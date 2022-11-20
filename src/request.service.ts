import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST})
export class RequestService {
    private userId: string

    setUserId(userId : string){
        console.log("setting")
        this.userId = userId
    }

    getUserId(){
        console.log("getting")
        return this.userId
    }
}