import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'

import { CreatePaymentDto } from './dto/createPayment.dto'
//import { PaymentService } from '@island.is/api/domains/payment'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment
  ) {}

  async createPayment(payment: CreatePaymentDto): Promise<Payment> {

    return this.paymentModel.create(payment)
  }

  async recreatedPayment(payment: CreatePaymentDto): Promise<Payment> {
    payment.definition = 'this payment was recreated by user.'

    // Service returns string on error, number on successful/not successful
    // const responseIsString = typeof response !== 'string'
    // const success = responseIsString && response === 1
    
    return this.paymentModel.create(payment)
  }
}