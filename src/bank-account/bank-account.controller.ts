import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankAccountNotFoundException } from 'src/exceptions/bank-account.exceptions';
import { InvalidInputException } from 'src/exceptions/global.exceptions';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {

    if(createBankAccountDto.currency !== 'EUR' && createBankAccountDto.currency !== 'USD') throw new InvalidInputException("Account currency should be either 'USD' or 'EUR'")

    return this.bankAccountService.create(createBankAccountDto);
  }

  @Get()
  findAll(): Promise<BankAccount[]> {
    return this.bankAccountService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BankAccount> {
    const foundAccount = await this.bankAccountService.findOne(id)

    if(!foundAccount) throw new BankAccountNotFoundException()

    return foundAccount;
  }

  @Get('owner/:id')
  findByOwnerId(@Param('id') ownerId: string): Promise<BankAccount[]> {
    return this.bankAccountService.findByOwnerId(ownerId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto):Promise<BankAccount> {
    const foundAccount = await this.bankAccountService.findOne(id)

    if(!foundAccount) throw new BankAccountNotFoundException()

    return this.bankAccountService.update(id, updateBankAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BankAccount> {
    const foundAccount = await this.bankAccountService.findOne(id)

    if(!foundAccount) throw new BankAccountNotFoundException()
    return this.bankAccountService.remove(id);
  }
}
