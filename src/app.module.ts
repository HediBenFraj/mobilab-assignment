import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccountModule } from './bank-account/bank-account.module';
import { config } from './config/keys';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { RequestService } from './request.service';
import { TransactionModule } from './transaction/transaction.module';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule,BankAccountModule, TransactionModule, MongooseModule.forRoot(config.mongoURI)],
  controllers: [AppController],
  providers: [AppService,AuthenticationMiddleware,RequestService,
  {
    provide: APP_INTERCEPTOR,
    scope: Scope.REQUEST,
    useClass : LoggingInterceptor
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }], 
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*')
  }
}
