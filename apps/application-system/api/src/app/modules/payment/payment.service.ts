import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import {
  ChargeResult,
  ApiDomainsPaymentService,
} from '@island.is/api/domains/payment'
import { BaseCharge, Charge } from '@island.is/clients/payment'
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
    baseCharge: BaseCharge,
    applicationId: string,
  ): Promise<ChargeResult> {
    // TODO: island.is x-road service path for callback.. ??
    // this can actually be a fixed url
    const callbackUrl = `https://localhost:3333/application/${applicationId}/payment/thiswillneverwork`

    const charge: Charge = {
      ...baseCharge,
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: `pay/${Date.now().toString(32)}`,
      immediateProcess: true,
      systemID: 'ISL',
      returnUrl: callbackUrl,
    }

    try {
      const result = await this.apiDomainsPaymentService.createCharge(charge)

      // TODO: we can remove this? Not sure why we need this
      // Calculate current time plus 48 hours. 86.400.000 is seconds in a day, 172.800.000 is two days.
      const calcExpiration = new Date().getTime() + 172800000

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

  findPaymentByApplicationId(applicationId: string): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: { [Op.eq]: applicationId },
      },
      limit: 1,
      order: [['modified', 'DESC']],
    })
  }
}
