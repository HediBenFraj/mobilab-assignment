import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { BankAccountModule } from 'src/bank-account/bank-account.module';
import { ConversionService } from './conversion/conversion.service';
import { HttpModule } from '@nestjs/axios'


@Module({
  imports : [HttpModule,BankAccountModule,MongooseModule.forFeature([{name: 'Transaction', schema:TransactionSchema}])],
  controllers: [TransactionController],
  providers: [TransactionService,ConversionService]
})
export class TransactionModule {}
