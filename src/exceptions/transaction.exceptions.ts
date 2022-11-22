import { HttpException, HttpStatus } from '@nestjs/common';

export class TransactionNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(msg || 'Transaction Not Found', status || HttpStatus.NOT_FOUND);
  }
}

export class LowBalanceException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(msg || 'Account Balance is low', status || HttpStatus.BAD_REQUEST);
  }
}
