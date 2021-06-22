import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'
import {
  Charge,
  PaymentAPI,
  PaymentServiceOptions,
  PAYMENT_OPTIONS,
} from '@island.is/clients/payment'
import type { User } from '@island.is/auth-nest-tools'
import { CreateChargeResult } from './payment.type'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(PAYMENT_OPTIONS)
    private paymentConfig: PaymentServiceOptions,
    private paymentApi: PaymentAPI,
  ) {}

  async findPaymentByApplicationId(
    applicationId: string,
  ): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: { [Op.eq]: applicationId },
      },
      limit: 1,
      order: [['modified', 'DESC']],
    })
  }

  private makePaymentUrl(docNum: string): string {
    return `${this.paymentConfig.arkBaseUrl}/quickpay/pay?doc_num=${docNum}`
  }

  async createCharge(
    payment: Payment,
    user: User,
  ): Promise<CreateChargeResult> {
    // TODO: island.is x-road service path for callback.. ??
    // this can actually be a fixed url
    const callbackUrl =
      ((this.paymentConfig.callbackBaseUrl +
        payment.application_id) as string) +
      this.paymentConfig.callbackAdditionUrl +
      payment.id

    const charge: Charge = {
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: payment.id.substring(0, 22),
      systemID: 'ISL',
      performingOrgID: '6509142520',
      payeeNationalID: user.nationalId,
      chargeType: 'AY1',
      performerNationalID: user.nationalId,
      charges: [
        {
          chargeItemCode: 'AY110',
          quantity: 1,
          priceAmount: payment.amount,
          amount: payment.amount,
          reference: '',
        },
      ],
      immediateProcess: true,
      returnUrl: callbackUrl,
    }

    const result = await this.paymentApi.createCharge(charge)

    return {
      ...result,
      paymentUrl: this.makePaymentUrl(result.user4),
    }
  }
}
