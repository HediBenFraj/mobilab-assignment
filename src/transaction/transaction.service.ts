import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { BankAccountNotFoundException } from '../exceptions/bank-account.exceptions';
import { InvalidInputException } from '../exceptions/global.exceptions';
import { LowBalanceException } from '../exceptions/transaction.exceptions';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly TransactionModel: Model<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction = new this.TransactionModel(createTransactionDto);
    return await newTransaction.save();
  }

  async findAll(
    asc: string,
    skip: number,
    limit: number,
  ): Promise<Transaction[]> {
    return await this.TransactionModel.find()
      .sort({ createdAt: asc === 'desc' ? 'desc' : 'asc' })
      .skip(skip)
      .limit(limit);
  }

  async findBetweenDates(
    startDate: string,
    endDate: string,
    asc: string,
    skip: number,
    limit: number,
  ): Promise<Transaction[]> {
    let createdAt;
    if (startDate && !endDate)
      createdAt = {
        $gte: startDate,
      };
    if (!startDate && endDate)
      createdAt = {
        $lte: endDate,
      };
    if (startDate && endDate)
      createdAt = {
        $gte: startDate,
        $lte: endDate,
      };

    return await this.TransactionModel.find({
      createdAt,
    })
      .sort({ createdAt: asc === 'desc' ? 'desc' : 'asc' })
      .skip(skip)
      .limit(limit);
  }

  async findOne(id: string): Promise<Transaction> {
    let foundTransaction;
    try {
      foundTransaction = await this.TransactionModel.findById(id);
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed'))
        throw new InvalidInputException('Invalid transaction id');
    }
    return foundTransaction;
  }

  async findBySenderAccountId(senderAccountId: string): Promise<Transaction[]> {
    return await this.TransactionModel.find({ senderAccountId });
  }

  async findByRecieverAccountId(
    recieverAccountId: string,
  ): Promise<Transaction[]> {
    return await this.TransactionModel.find({ recieverAccountId });
  }

  async remove(id: string): Promise<Transaction> {
    return await this.TransactionModel.findByIdAndRemove(id);
  }

  verifyTransactionInput(
    senderAccount: BankAccount,
    recieverAccount: BankAccount,
    amount: number,
  ) {
    if (!senderAccount)
      throw new BankAccountNotFoundException(
        'An account with senderId was not found',
      );
    if (!recieverAccount)
      throw new BankAccountNotFoundException(
        'An account with recieverId was not found',
      );

    if (senderAccount.id == recieverAccount.id)
      throw new HttpException(
        'senderAccountId and recieverAccountId must be different',
        HttpStatus.BAD_REQUEST,
      );

    if (senderAccount.balance < amount) throw new LowBalanceException();
  }
}
