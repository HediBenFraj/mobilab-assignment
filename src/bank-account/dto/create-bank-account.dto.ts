import { IsNotEmpty, IsString } from "class-validator";

export class CreateBankAccountDto {
    @IsString()
    @IsNotEmpty()
    readonly currency: string;
    
    readonly name: string;
}
