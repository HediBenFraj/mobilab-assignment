import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  readonly currency: string;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly balance: number;
}
