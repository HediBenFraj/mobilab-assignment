import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {

  constructor(@InjectModel('BankAccount') private readonly BankAccountModel:Model<BankAccount>){}

  async create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
    const newBankAccount = new this.BankAccountModel(createBankAccountDto)
    return await newBankAccount.save()
  }

  async findAll():Promise<BankAccount[]> {
    return await this.BankAccountModel.find()
  }

  async findOne(id: string) : Promise<BankAccount> {
    return await this.BankAccountModel.findById(id)
  }

  async findByOwnerId(ownerId: string) : Promise<BankAccount[]> {
    return await this.BankAccountModel.find({ownerId})
  }

  async update(id: string, updateBankAccountDto: UpdateBankAccountDto): Promise<BankAccount> {
    return await this.BankAccountModel.findByIdAndUpdate(id, updateBankAccountDto, {new: true})
  }

  async remove(id: string): Promise<BankAccount> {
    return await this.BankAccountModel.findByIdAndRemove(id)
  }
}
