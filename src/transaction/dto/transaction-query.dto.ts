import { IsString } from 'class-validator';

export class TransactionQueryDto {
  readonly startDate: string;

  readonly endDate: string;

  readonly ASC: string;
}
