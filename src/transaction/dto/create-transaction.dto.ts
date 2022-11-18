import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    readonly senderAccountId: string;

    @IsString()
    @IsNotEmpty()
    readonly recieverAccountId: string;

  
    readonly currency: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;
    

}
