import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidInputException extends HttpException{
    constructor(msg?: string, status?: HttpStatus){
        super(msg || "Invalid Input Exception", status || HttpStatus.BAD_REQUEST)
    }
}