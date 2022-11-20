import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversionService } from '../conversion/conversion.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
import * as mongoose from 'mongoose'
import { InvalidInputException } from '../exceptions/global.exceptions';
import { RequestService } from '../request.service';

@Injectable()
export class BankAccountService {
  constructor(@InjectModel('BankAccount') private readonly BankAccountModel:Model<BankAccount>, private readonly requestService: RequestService,private readonly conversionService:ConversionService){}

  async create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
 
    const userId = this.requestService.getUserId() || "some user id"

    const newBankAccount = new this.BankAccountModel({
      ...createBankAccountDto,
      ownerId : userId
    })

    return await newBankAccount.save()
  }

  async findAll(asc:string, skip: number, limit: number):Promise<BankAccount[]> { 
    return await this.BankAccountModel.find().sort({ createdAt: asc === 'desc' ? 'desc': "asc"}).skip(skip).limit(limit)
  }

  async findOne(id: string) : Promise<BankAccount> {

    let foundAccount
    try {
      foundAccount = await this.BankAccountModel.findById(id)
    } catch (error) {
      if(error.message.includes('Cast to ObjectId failed')) throw new InvalidInputException('Invalid bank account id')
    }

    return foundAccount
  }

  async findByOwnerId(ownerId: string) : Promise<BankAccount[]> {
    return await this.BankAccountModel.find({ownerId})
  }

  async update(id: string, updateBankAccountDto: UpdateBankAccountDto): Promise<BankAccount> {
    return await this.BankAccountModel.findByIdAndUpdate(id, updateBankAccountDto, {new: true})
  }

  async patch(id: string, patchAccount: object,session: mongoose.ClientSession | null = null,): Promise<BankAccount> {
    return await this.BankAccountModel.findByIdAndUpdate(id, patchAccount, {new: true}).session(session)
  }

  async remove(id: string): Promise<BankAccount> {
    return await this.BankAccountModel.findByIdAndRemove(id)
  }

  async updateBankAccountBalances(senderAccount: BankAccount,recieverAccount: BankAccount, amount: number,  session: mongoose.ClientSession | null = null,){
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

    this.patch(senderAccount.id, {balance : newSenderAccountBalance},session)
    this.patch(recieverAccount.id, {balance : newRecieverAccountBalance},session)

    return {conversionObject,newSenderAccountBalance,newRecieverAccountBalance}
  }

}
