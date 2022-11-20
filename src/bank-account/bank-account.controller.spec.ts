import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';

describe('BankAccountController', () => {
  let controller: BankAccountController;

  const mockBankAccountService = {
      create: jest.fn().mockImplementation(dto => {
        return {
          id : Date.now(),
          ...dto
        }
      }),
      update: jest.fn().mockImplementation((id,dto)=>{
        return {
          id,
          ...dto
        }
      })
  }
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountController],
      providers: [
        {
          provide: BankAccountService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BankAccountController>(BankAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bank account',()=>{
    const createDto = {
      currency : 'USD',
      balance : 0,
      name :"some account"
    }

    expect(controller.create(createDto)).toEqual({
      id: expect.any(Number),
      ...createDto
    })

    /* We can add these assertions but it will make the controller tests brittle 
       in the case where controller logic is changged
     expect(mockBankAccountService.create).toHaveBeenCalledTimes(1)
     expect(mockBankAccountService.create).toHaveBeenCalledWith(dto) */
  })

  it('should update a bank account',()=>{
    const updateDto = {
      currency : 'USD',
      name :"New Account",
      balance: 200
    }

    expect(controller.update('1',updateDto)).toEqual({
      id: '1',
      ...updateDto
    })


  })
});
