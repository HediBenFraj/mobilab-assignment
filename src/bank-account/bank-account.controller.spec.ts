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
      providers: [BankAccountService],
    }).overrideProvider(BankAccountService).useValue(mockBankAccountService).compile();

    controller = module.get<BankAccountController>(BankAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bank account',()=>{
    const createDto = {
      ownerId : "12312",
      currency : 'USD',
      name :"New Account"
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
      ownerId : "12312",
      currency : 'USD',
      name :"New Account"
    }

    expect(controller.update('1',updateDto)).toEqual({
      id: '1',
      ...updateDto
    })


  })
});
