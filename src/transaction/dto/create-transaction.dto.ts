import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly senderAccountId: string;

  @IsString()
  @IsNotEmpty()
  readonly recieverAccountId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly sentAmount: number;

  readonly fromCurrency: string;

  readonly toCurrency: string;

  readonly recievedAmount: number;

  readonly conversionRate: number;

  readonly note: string;
}
