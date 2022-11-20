import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
import { BankAccountNotFoundException } from '../exceptions/bank-account.exceptions';
import { InvalidInputException } from '../exceptions/global.exceptions';
import { PaginationParams } from '../transaction/dto/pagination.params';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {

    if(createBankAccountDto.currency !== 'EUR' && createBankAccountDto.currency !== 'USD') throw new InvalidInputException("Account currency should be either 'USD' or 'EUR'")

    return this.bankAccountService.create(createBankAccountDto);
  }

  @Get()
  findAll(@Query(){skip,limit,ASC}: PaginationParams): Promise<BankAccount[]> {
    return this.bankAccountService.findAll(ASC,skip,limit);
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
