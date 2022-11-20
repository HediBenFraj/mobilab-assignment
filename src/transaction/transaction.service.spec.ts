import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { Transaction } from './entities/transaction.entity';
import { TransactionSchema } from './schemas/transaction.schema';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;


  let TransactionModel = mongoose.model(Transaction.name,TransactionSchema)


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService,
        { 
          provide: getModelToken(Transaction.name), 
          useValue: TransactionModel  // <-- Use the Model Class from Mongoose
        }],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
