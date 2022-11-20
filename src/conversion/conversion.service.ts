import { Injectable, Logger } from "@nestjs/common";
import { config } from "src/config/keys";
import { HttpService, } from '@nestjs/axios'
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class ConversionService {
    private readonly logger = new Logger(ConversionService.name)
    constructor(private readonly httpService:HttpService){}

    async convert(amount,fromCurrency,toCurrency){
      this.logger.log(ConversionService.name)

        const options = {
            method: 'GET',
            url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
            params: {format: 'json', from: fromCurrency, to: toCurrency, amount: amount},
            headers: {
              'X-RapidAPI-Key': config['X-RapidAPI-Key'],
              'X-RapidAPI-Host': config['X-RapidAPI-Host']
            }
          };

        const {data} = await firstValueFrom(this.httpService.request(options).pipe( catchError((error: any) => {
            this.logger.debug(error.response.data);
            throw 'An error happened!';
          }),))

          const convertedAmount = parseFloat(data.rates[toCurrency].rate_for_amount)
          const conversionRate = parseFloat(data.rates[toCurrency].rate)
    
          return {convertedAmount,conversionRate}
    

     
    }
}