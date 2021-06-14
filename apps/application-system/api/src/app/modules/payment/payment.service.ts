import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import {
  ChargeResult,
  ApiDomainsPaymentService,
} from '@island.is/api/domains/payment'
import { Charge } from '@island.is/clients/payment'
import { Op } from 'sequelize'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(ApiDomainsPaymentService)
    private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createPayment(
    charge: Charge,
    returnUrl: string,
    applicationId: string,
  ): Promise<ChargeResult> {
    try {
      const result = await this.apiDomainsPaymentService.createCharge(
        charge,
        returnUrl,
      )

      // Calculate current time plus 48 hours. 86.400.000 is seconds in a day, 172.800.000 is two days.
      const calcExpiration = new Date().getTime() + 172800000
      console.log(
        'The expiration date of payment application: ' +
          new Date(calcExpiration),
      )
      console.log('payment service')
      console.log(JSON.stringify(charge, null, 4))
      console.log(JSON.stringify(result, null, 4))
      const paymentDto = {
        application_id: applicationId,
        fulfilled: false,
        user4: result.data?.paymentUrl as string,
        definition: charge.chargeItemSubject,
        amount: charge.payInfo?.payableAmount || 0,
        expires_at: new Date(calcExpiration),
        reference_id: result.data?.receptionID,
      }
      this.paymentModel.create(paymentDto)
      return result
    } catch (e) {
      console.log(JSON.stringify(e, null, 4))
      return {
        success: false,
        error: e as Error,
      }
    }
  }

  findPaymentByApplicationId(
    applicationId: string,
  ): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: { [Op.eq]: applicationId }
      },
      limit: 1,
      order: [['modified', 'DESC']],
    })
  }
}
