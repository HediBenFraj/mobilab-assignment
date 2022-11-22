import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { BankAccountService } from '../bank-account/bank-account.service';
import { BankAccountNotFoundException } from '../exceptions/bank-account.exceptions';
import { TransactionNotFoundException } from '../exceptions/transaction.exceptions';
import * as mongoose from 'mongoose';
import { PaginationParams } from './dto/pagination.params';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('transaction')
export class TransactionController {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly transactionService: TransactionService,
    private readonly bankAccountService: BankAccountService,
  ) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { recieverAccountId, senderAccountId } = createTransactionDto;

    const senderAccount = await this.bankAccountService.findOne(
      senderAccountId,
    );
    const recieverAccount = await this.bankAccountService.findOne(
      recieverAccountId,
    );

    this.transactionService.verifyTransactionInput(
      senderAccount,
      recieverAccount,
      createTransactionDto.sentAmount,
    );

    const session = await this.connection.startSession();

    let savedTransaction;
    await session.withTransaction(async () => {
      const { conversionObject } =
        await this.bankAccountService.updateBankAccountBalances(
          senderAccount,
          recieverAccount,
          createTransactionDto.sentAmount,
          session,
        );

      savedTransaction = await this.transactionService.create({
        ...createTransactionDto,
        fromCurrency: senderAccount.currency,
        toCurrency: recieverAccount.currency,
        recievedAmount: conversionObject.convertedAmount,
        conversionRate: conversionObject.conversionRate,
      });
    });
    session.endSession();

    return savedTransaction;
  }

  @Get()
  async findAll(
    @Query() { skip, limit, startDate, endDate, ASC }: PaginationParams,
  ) {
    if (!startDate && !endDate)
      return this.transactionService.findAll(ASC, skip, limit);

    return this.transactionService.findBetweenDates(
      startDate,
      endDate,
      ASC,
      skip,
      limit,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    const foundTransaction = await this.transactionService.findOne(id);

    if (!foundTransaction) throw new TransactionNotFoundException();

    return foundTransaction;
  }

  @Get('sender-account/:id')
  async findBySenderAccountId(
    @Param('id') senderAccountId: string,
  ): Promise<Transaction[]> {
    const foundAccount = await this.bankAccountService.findOne(senderAccountId);

    if (!foundAccount) throw new BankAccountNotFoundException();

    return this.transactionService.findBySenderAccountId(senderAccountId);
  }

  @Get('reciever-account/:id')
  async findByRecieverAccountId(
    @Param('id') recieverAccountId: string,
  ): Promise<Transaction[]> {
    const foundAccount = await this.bankAccountService.findOne(
      recieverAccountId,
    );

    if (!foundAccount) throw new BankAccountNotFoundException();

    return this.transactionService.findByRecieverAccountId(recieverAccountId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Transaction> {
    const foundTransaction = await this.transactionService.findOne(id);

    if (!foundTransaction) throw new TransactionNotFoundException();

    return this.transactionService.remove(id);
  }
}
