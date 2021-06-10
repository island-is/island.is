import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'

import { CreatePaymentDto } from './dto/createPayment.dto'
import { User } from '@island.is/auth-nest-tools'
//import { PaymentService } from '@island.is/api/domains/payment'
//import { PaymentController } from './payment.controller'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import { ChargeResult, ApiDomainsPaymentService } from '@island.is/api/domains/payment'
import { Charge } from '@island.is/clients/payment'


@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(ApiDomainsPaymentService)
    private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createPayment(charge: Charge, returnUrl: string, applicationId: string): Promise<ChargeResult> { // change any to createpaymentresponsedto ?
    try {
      const result = await this.apiDomainsPaymentService.createCharge(charge, returnUrl)

      // Calculate current time plus 24 hours. 86.400.000 is seconds in a day
      let calcExpiration = new Date().getTime() + 86400000
      console.log('The expiration date of payment application: ' + new Date(calcExpiration))
      console.log('payment service')
      console.log(JSON.stringify(charge, null, 4));
      console.log(JSON.stringify(result, null, 4));
      const paymentDto = {
        applicationId: applicationId, //applicationId != "" ? applicationId : '123456789',
        fulfilled: false,
        user4: "cool url bro", //result.data?.paymentUrl as string
        definition: '123', //result.data?.user4 as string,
        amount: 2288,//charge.payInfo?.payableAmount != null ? charge.payInfo?.payableAmount as number : 999,
        expiresAt: new Date(calcExpiration),
        id: '44444',
        referenceId: "666666"
      }
      this.paymentModel.create(paymentDto)
      return result

    } catch (e) {
      console.log('payment.service error')
      console.log(JSON.stringify(e, null, 4))
      return {
        success: false,
        error: e as Error,
      }
    }
    // kalla i api domains create charge
    // createmodel
    //return this.paymentController.paymentApplication(payment, user)
  }

  async createPaymentModel(payment: CreatePaymentDto): Promise<CreatePaymentResponseDto> {
    const createObj = {
      applicationId: '123',
      fulfilled: false,
      user4: 'nuice',
      definition: 'DATA IS FAKED, CUZ THIS NEEDS REMOVAL FROM CONTROLLER.',
      amount: 963,
      expiresAt: new Date(),
      id: '12333',
      referenceId: "555555"
    }
    return this.paymentModel.create(createObj)
  }

  async recreatedPayment(payment: CreatePaymentDto): Promise<Payment> {
    payment.definition = 'this payment was recreated by user.'

    // Service returns string on error, number on successful/not successful
    // const responseIsString = typeof response !== 'string'
    // const success = responseIsString && response === 1
    
    return this.paymentModel.create(payment)
  }
}