import {
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsDefined,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  startDate: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  endDate: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  ASC: string;
}
