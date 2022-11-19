import { HttpException, HttpStatus } from "@nestjs/common";

export class BankAccountNotFoundException extends HttpException{
    constructor(msg?: string, status?: HttpStatus){
        super(msg || "Bank Account Not Found", status || HttpStatus.NOT_FOUND)
    }
}