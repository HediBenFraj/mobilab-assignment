import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsertNotAuthenticatedException } from "src/exceptions/user.exceptions";
import { RequestService } from "../request/request.service";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware{
    private readonly logger = new Logger(AuthenticationMiddleware.name)

    constructor(private readonly requestService: RequestService){}

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(AuthenticationMiddleware.name)
        // Authentication impelmentation
        
        if(req.headers.userid ){
            const userId: string = req.headers.userid.toString()
            this.requestService.setUserId(userId)

            next()    
        }else{
            throw new UsertNotAuthenticatedException()
        }

    }
}