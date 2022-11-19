import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { BankAccountNotFoundException } from 'src/exceptions/bank-account.exceptions';
import { LowBalanceException } from 'src/exceptions/transaction.exceptions';
import { ConversionService } from './conversion/conversion.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';


@Injectable()
export class TransactionService {

  constructor(
  @InjectModel('Transaction') private readonly TransactionModel:Model<Transaction>,
   private readonly bankAccountService : BankAccountService, 
   private readonly conversionService:ConversionService){}

  async create(createTransactionDto: CreateTransactionDto):Promise<Transaction> {
    const newTransaction = new this.TransactionModel(createTransactionDto)
    return await newTransaction.save()
  }

  async findAll(asc:string, skip: number, limit: number): Promise<Transaction[]>{
    return await this.TransactionModel.find().sort({ createdAt: asc === 'desc' ? 'desc': "asc"}).skip(skip).limit(limit)
  }

  async findBetweenDates(startDate: string,endDate: string,asc:string, skip: number, limit: number): Promise<Transaction[]>{

    let createdAt
    if(startDate && !endDate) createdAt = {
      $gte: startDate,
    }
    if(!startDate && endDate) createdAt = {
      $lte: endDate
    }
    if(startDate && endDate) createdAt ={
      $gte: startDate,
      $lte: endDate
    }
    
    return await this.TransactionModel.find({ 
      createdAt
      }).sort({ createdAt: asc === 'desc' ? 'desc': "asc"}).skip(skip).limit(limit)
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

   handleTransactionExceptions(senderAccount: BankAccount, recieverAccount: BankAccount, amount: number){

    if(!senderAccount) throw new BankAccountNotFoundException('An account with senderId was not found')
    if(!recieverAccount) throw new BankAccountNotFoundException('An account with recieverId was not found')
    console.log(senderAccount)
    if(senderAccount.id == recieverAccount.id) throw new HttpException('senderAccountId and recieverAccountId must be different',HttpStatus.BAD_REQUEST)

    if(senderAccount.balance < amount) throw new LowBalanceException()
  }

  async updateBankAccountBalances(senderAccount: BankAccount,recieverAccount: BankAccount, amount: number){
    let newSenderAccountBalance;
    let newRecieverAccountBalance;
    let conversionObject

    const accountsHaveSameCurrency =senderAccount.currency === recieverAccount.currency
    if(accountsHaveSameCurrency){
       newSenderAccountBalance = senderAccount.balance -= amount 
       newRecieverAccountBalance = recieverAccount.balance += amount
    }else{
      conversionObject = await this.conversionService.convert(amount,senderAccount.currency,recieverAccount.currency)
      
      newSenderAccountBalance = senderAccount.balance - amount
      newRecieverAccountBalance =recieverAccount.balance + conversionObject.convertedAmount
    }

    this.bankAccountService.patch(senderAccount.id, {balance : newSenderAccountBalance})
    this.bankAccountService.patch(recieverAccount.id, {balance : newRecieverAccountBalance})

    return conversionObject
  }

}
