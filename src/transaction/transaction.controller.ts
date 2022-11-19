import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction>  {
    return this.transactionService.findOne(id);
  }

  @Get('sender-account/:id')
  findBySenderAccountId(@Param('id') senderAccountId: string): Promise<Transaction[]>  {
    return this.transactionService.findBySenderAccountId(senderAccountId);
  }

  @Get('reciever-account/:id')
  findByRecieverAccountId(@Param('id') recieverAccountId: string): Promise<Transaction[]>  {
    return this.transactionService.findByRecieverAccountId(recieverAccountId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Transaction>  {
    return this.transactionService.remove(id);
  }

}
