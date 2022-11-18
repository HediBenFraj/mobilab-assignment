import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccountSchema } from './schemas/bank-account.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'BankAccount',schema:BankAccountSchema}])],
  controllers: [BankAccountController],
  providers: [BankAccountService]
})
export class BankAccountModule {}
