import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { InvalidInputException } from '../exceptions/global.exceptions';
import { config } from '../config/keys';
import { ConversionService } from '../conversion/conversion.service';
import { RequestService } from '../request/request.service';
import { BankAccountService } from './bank-account.service';
import { BankAccount } from './entities/bank-account.entity';
import { BankAccountSchema } from './schemas/bank-account.schema';

describe('BankAccountService', () => {
  let service: BankAccountService;
  let requestService: RequestService;
  let conversionService: ConversionService;

  const mockBankAccount = (
    _id = 'some id',
    currency = 'EUR',
    ownerId = 'some owner id',
    balance = 0,
    name = 'New EUR Account',
  ) => ({
    _id,
    ownerId,
    balance,
    currency,
    name,
  });

  const mockBankAccountDoc = (mock) => ({
    name: mock?.name || 'New EUR Account',
    currency: mock?.currency || 'EUR',
    _id: mock?.id || 'some id',
    ownerId: mock?.ownerId || 'some owner id',
    balance: mock?.balance || 0,
  });

  const BankAccountArray = [
    mockBankAccount('6377a0c7ec5b41b08e8b527d', 'USD'),
    mockBankAccount('6377a2fe1c99b5440fe5c9ed'),
    mockBankAccount('6377ac4cfd59cc4418f4bcef'),
  ];

  const BankAccountDocumentsArray = [
    mockBankAccountDoc({ id: '6377a0c7ec5b41b08e8b527d', currency: 'USD' }),
    mockBankAccountDoc({ id: '6377a2fe1c99b5440fe5c9ed' }),
    mockBankAccountDoc({ id: '6377ac4cfd59cc4418f4bcef' }),
  ];

  const mockRequestServcie = {
    getUserId: jest.fn().mockImplementation(() => {
      return 'someId';
    }),
  };

  const mockConversionService = {
    convert: jest
      .fn()
      .mockImplementation((amount, fromCurrency, toCurrency) => ({
        amount,
        fromCurrency,
        toCurrency,
      })),
  };

  let BankAccountModel = mongoose.model(BankAccount.name, BankAccountSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountService,
        {
          provide: RequestService,
          useValue: mockRequestServcie,
        },
        {
          provide: ConversionService,
          useValue: mockConversionService,
        },
        {
          provide: getModelToken(BankAccount.name),
          useValue: BankAccountModel, // <-- Use the Model Class from Mongoose
        },
      ],
    }).compile();

    service = module.get<BankAccountService>(BankAccountService);
    requestService = module.get<RequestService>(RequestService);
    conversionService = module.get<ConversionService>(ConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all bank accounts', async () => {
    jest
      .spyOn(BankAccountModel, 'find')
      .mockReturnValueOnce(BankAccountDocumentsArray as any);
    const bankAccounts = await service.findAll();
    expect(bankAccounts).toEqual(BankAccountArray);
  });

  it('should return one Account for an existing and valid objectId', async () => {
    jest
      .spyOn(BankAccountModel, 'findById')
      .mockReturnValueOnce(
        BankAccountDocumentsArray.find(
          (e) => e._id === '6377ac4cfd59cc4418f4bcef',
        ) as any,
      );
    const foundAccount = await service.findOne('6377ac4cfd59cc4418f4bcef');
    expect(foundAccount).toEqual(
      BankAccountArray.find((e) => e._id === '6377ac4cfd59cc4418f4bcef'),
    );
  });

  it('should throw an InvalidInputException if given a non valid ObjectId', async () => {
    await expect(service.findOne('4')).rejects.toThrowError(
      InvalidInputException,
    );
  });

  // it('should create a bank account if input is correct',async () => {

  //   const createAccountDto = {currency : 'EUR', name :"EUR Acc", balance: 100}

  //   jest.spyOn(requestService,'getUserId').mockImplementation(()=> {
  //     return "some id"
  //   })
  //   jest.spyOn(BankAccountModel, "create").mockImplementation(()=>{
  //     return ({
  //       _id : "some id",
  //       ...createAccountDto
  //     })
  //   })

  //   const createdAccount = await service.create(createAccountDto)
  //   expect(createdAccount).toBe(mockBankAccountDoc(createAccountDto))
  // });

  it('should covert money if currencies are different ', async () => {
    const converRequestBody = {
      senderAccount: { ...BankAccountArray[0], id: BankAccountArray[0]._id },
      recieverAccount: { ...BankAccountArray[1], id: BankAccountArray[1]._id },
      amount: 20,
    };

    jest.spyOn(conversionService, 'convert').mockReturnValueOnce({
      convertedAmount: converRequestBody.amount * 1.2,
      conversionRate: 1.2,
    } as any);

    const { conversionObject } = await service.updateBankAccountBalances(
      converRequestBody.senderAccount,
      converRequestBody.recieverAccount,
      converRequestBody.amount,
    );

    expect(conversionObject).toEqual({
      convertedAmount: converRequestBody.amount * 1.2,
      conversionRate: 1.2,
    });
  });

  it('should not convert money if currencies are similar ', async () => {
    const converRequestBody = {
      senderAccount: { ...BankAccountArray[1], id: BankAccountArray[1]._id },
      recieverAccount: { ...BankAccountArray[2], id: BankAccountArray[2]._id },
      amount: 20,
    };

    jest.spyOn(conversionService, 'convert').mockReturnValueOnce({
      convertedAmount: converRequestBody.amount * 1.2,
      conversionRate: 1.2,
    } as any);

    const { conversionObject } = await service.updateBankAccountBalances(
      converRequestBody.senderAccount,
      converRequestBody.recieverAccount,
      converRequestBody.amount,
    );

    expect(conversionObject).toEqual(undefined);
  });

  it('should update account balances', async () => {
    const converRequestBody = {
      senderAccount: { ...BankAccountArray[0], id: BankAccountArray[0]._id },
      recieverAccount: { ...BankAccountArray[1], id: BankAccountArray[1]._id },
      amount: 20,
    };

    jest.spyOn(conversionService, 'convert').mockReturnValueOnce({
      convertedAmount: converRequestBody.amount * 1.2,
      conversionRate: 1.2,
    } as any);

    const updateBankAccountsOutput = await service.updateBankAccountBalances(
      converRequestBody.senderAccount,
      converRequestBody.recieverAccount,
      converRequestBody.amount,
    );

    expect(updateBankAccountsOutput.newSenderAccountBalance).toEqual(
      converRequestBody.senderAccount.balance - converRequestBody.amount,
    );
    expect(updateBankAccountsOutput.newRecieverAccountBalance).toEqual(
      converRequestBody.recieverAccount.balance +
        updateBankAccountsOutput.conversionObject.convertedAmount,
    );
  });
});
