import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccountModule } from './bank-account/bank-account.module';
import { config } from './config/keys';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { RequestService } from './request.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [BankAccountModule, TransactionModule, MongooseModule.forRoot(config.mongoURI)],
  controllers: [AppController],
  providers: [AppService,AuthenticationMiddleware,RequestService,
  {
    provide: APP_INTERCEPTOR,
    scope: Scope.REQUEST,
    useClass : LoggingInterceptor
  }],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*')
  }
}
