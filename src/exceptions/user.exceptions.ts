import { HttpException, HttpStatus } from "@nestjs/common";

export class UsertNotAuthenticatedException extends HttpException{
    constructor(msg?: string, status?: HttpStatus){
        super(msg || "User Not Authenticated", status || HttpStatus.UNAUTHORIZED)
    }
}