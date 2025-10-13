import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'

import { JwksGuard } from './guards/jwks.guard'
import { AppService } from './app.service'
import type { PaymentCallbackPayload } from './types'

@Controller()
@UseGuards(JwksGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async onPaymentFlowUpdate(@Body() body: PaymentCallbackPayload) {
    await this.appService.handlePaymentFlowUpdate(body)
  }
}
