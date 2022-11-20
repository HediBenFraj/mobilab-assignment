import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBankAccountDto {

    @IsString()
    @IsNotEmpty()
    readonly currency: string;

    @IsString()
    readonly name: string;

    
}
