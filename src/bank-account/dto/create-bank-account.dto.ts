import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateBankAccountDto {
    @IsString()
    @IsNotEmpty()
    readonly currency: string;
    
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly balance: number
}
