import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  create(@Body() createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
    return this.bankAccountService.create(createBankAccountDto);
  }

  @Get()
  findAll(): Promise<BankAccount[]> {
    return this.bankAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BankAccount> {
    return this.bankAccountService.findOne(id);
  }

  @Get('owner/:id')
  findByOwnerId(@Param('id') ownerId: string): Promise<BankAccount[]> {
    return this.bankAccountService.findByOwnerId(ownerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto):Promise<BankAccount> {
    return this.bankAccountService.update(id, updateBankAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<BankAccount> {
    return this.bankAccountService.remove(id);
  }
}
