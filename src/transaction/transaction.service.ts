import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';


@Injectable()
export class TransactionService {

  constructor(@InjectModel('Transaction') private readonly TransactionModel:Model<Transaction>){}

  async create(createTransactionDto: CreateTransactionDto):Promise<Transaction> {
    const newTransaction = new this.TransactionModel(createTransactionDto)
    return await newTransaction.save()
  }

  async findAll(): Promise<Transaction[]>{
    return await this.TransactionModel.find()
  }

  async findOne(id: string): Promise<Transaction> {
    return await this.TransactionModel.findById(id)
  }


  async findBySenderAccountId(senderAccountId: string): Promise<Transaction[]> {
    return await this.TransactionModel.find({senderAccountId})
  }

  async findByRecieverAccountId(recieverAccountId: string): Promise<Transaction[]> {
    return await this.TransactionModel.find({recieverAccountId})
  }



  async remove(id: string): Promise<Transaction> {
    return await this.TransactionModel.findByIdAndRemove(id)
  }
}
