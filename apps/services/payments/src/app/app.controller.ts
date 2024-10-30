import { Controller, Get, Post } from '@nestjs/common'

import { AppService } from './app.service'
import { PaymentInformation } from '../types'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Handler for getting payment info, receives a payment ID
  @Get('payment/:id')
  getPaymentInfo(): { paymentInfo: PaymentInformation } {
    // dynamic id parameter from the URL
    const id = 'todo'

    return this.appService.getPaymentInfo(id)
  }

  @Post('payment')
  createPaymentUrl(paymentInfo: PaymentInformation) {
    return this.appService.createPaymentUrl(paymentInfo)
  }
}
