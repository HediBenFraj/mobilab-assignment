import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBankAccountDto {

    @IsString()
    @IsOptional()
    readonly currency: string;

    @IsString()
    @IsOptional()
    readonly name: string;

    
}
