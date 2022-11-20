import { Injectable } from '@nestjs/common';
import { RequestService } from './request/request.service';

@Injectable()
export class AppService {
  constructor(private readonly requestService: RequestService){}
  getHello(): string {
    console.log(this.requestService.getUserId())
    return 'Hello World!';
  }
}
