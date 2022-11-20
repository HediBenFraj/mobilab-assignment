import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccountSchema } from './schemas/bank-account.schema';
import { RequestService } from '../request/request.service'
import { ConversionService } from 'src/conversion/conversion.service';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: 'BankAccount',schema:BankAccountSchema}])],
  controllers: [BankAccountController],
  providers: [BankAccountService, RequestService, ConversionService],
  exports: [BankAccountService]
})
export class BankAccountModule {}