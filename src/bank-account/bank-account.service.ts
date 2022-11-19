import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestService } from 'src/request.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {

  private readonly logger = new Logger(BankAccountService.name)

  constructor(@InjectModel('BankAccount') private readonly BankAccountModel:Model<BankAccount>, private readonly requestService: RequestService){}

  async create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
    const userId = this.requestService.getUserId()

    const newBankAccount = new this.BankAccountModel({
      ...createBankAccountDto,
      ownerId : userId
    })

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



  log(method){
    this.logger.log(`${BankAccountService.name}: ${method.name}`)
  }
}
