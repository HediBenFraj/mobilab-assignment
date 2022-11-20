import { getConnectionToken } from '@nestjs/mongoose';
import * as supertest from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountService } from '..//bank-account/bank-account.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('TransactionController', () => {
  let app: INestApplication;
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService,
      {
        provide : TransactionService,
        useValue : {}
      },
      {
        provide: BankAccountService,
        useValue : {}
      },
      {
        provide: getConnectionToken('Database'),
        useValue: {},
      }
    ],
    }).compile();
    
    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    controller = module.get<TransactionController>(TransactionController)
    await app.init()

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
});
