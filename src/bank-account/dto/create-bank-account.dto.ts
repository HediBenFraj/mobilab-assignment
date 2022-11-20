import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBankAccountDto {
    @IsString()
    @IsNotEmpty()
    readonly currency: string;
    
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNumber()
    readonly balance: number
}
