import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { BankAccountNotFoundException } from 'src/exceptions/bank-account.exceptions';
import { InvalidInputException, LowBalanceException, TransactionNotFoundException } from 'src/exceptions/transaction.exceptions';
import { ConversionService } from './conversion/conversion.service';
import { query } from 'express';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { PaginationParams } from './entities/pagination.params';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService, private readonly bankAccountService : BankAccountService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const {recieverAccountId, senderAccountId} = createTransactionDto

    const senderAccount = await this.bankAccountService.findOne(senderAccountId)
    const recieverAccount = await this.bankAccountService.findOne(recieverAccountId)

    this.transactionService.handleTransactionExceptions(senderAccount,recieverAccount,createTransactionDto.sentAmount)
     
    const conversionObject = await this.transactionService.updateBankAccountBalances(senderAccount,recieverAccount,createTransactionDto.sentAmount)

    return this.transactionService.create({
      senderAccountId,
       recieverAccountId,
        fromCurrency: senderAccount.currency,
         toCurrency: recieverAccount.currency,
         sentAmount: createTransactionDto.sentAmount,
         recievedAmount : conversionObject.convertedAmount,
         conversionRate : conversionObject.conversionRate,
         note : createTransactionDto.note
         });
  }

  @Get()
  async getAllPosts(@Query() { skip, limit, startDate, endDate, ASC }: PaginationParams) {

    
    if(!startDate && !endDate) return this.transactionService.findAll(ASC,skip,limit);

    return this.transactionService.findBetweenDates(startDate,endDate,ASC,skip,limit)
    
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction>  {
    const foundTransaction = await this.transactionService.findOne(id)
    
    if(!foundTransaction) throw new TransactionNotFoundException()

    return foundTransaction;
  }

  @Get('sender-account/:id')
  async findBySenderAccountId(@Param('id') senderAccountId: string): Promise<Transaction[]>  {
    const foundAccount = await this.bankAccountService.findOne(senderAccountId)

    if(!foundAccount) throw new BankAccountNotFoundException()

    return this.transactionService.findBySenderAccountId(senderAccountId);
  }

  @Get('reciever-account/:id')
  async findByRecieverAccountId(@Param('id') recieverAccountId: string): Promise<Transaction[]>  {
    const foundAccount = await this.bankAccountService.findOne(recieverAccountId)

    if(!foundAccount) throw new BankAccountNotFoundException()

    return this.transactionService.findByRecieverAccountId(recieverAccountId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Transaction>  {
    const foundTransaction = await this.transactionService.findOne(id)
    
    if(!foundTransaction) throw new TransactionNotFoundException()

    return this.transactionService.remove(id);
  }

}
