import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'
import { BaseCharge, Charge, ChargeResponse, PaymentAPI } from '@island.is/clients/payment'
import { CreatePaymentDto } from './dto/createPayment.dto'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import { PaymentConfig, PAYMENT_CONFIG } from './payment.configuration'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(PAYMENT_CONFIG)
    private paymentConfig: PaymentConfig,
    @Inject(PaymentAPI)
    private paymentApi: PaymentAPI,
  ) {}

  findPaymentByApplicationId(applicationId: string): Promise<Payment | null> {
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

  async createCharge(applicationId: string, baseCharge: BaseCharge): Promise<CreatePaymentResponseDto> {
    const callbackUrl =
      ((this.paymentConfig.callbackBaseUrl + applicationId) as string) +
      this.paymentConfig.callbackAdditionUrl

    const charge: Charge = {
      ...baseCharge,
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: `pay/${Date.now().toString(32)}`,
      immediateProcess: true,
      systemID: 'ISL',
      returnUrl: callbackUrl,
      chargeType: 'AY1',
      payInfo: {
        RRN: '',
        cardType: '',
        paymentMeans: '',
        authCode: '',
        PAN: '',
        payableAmount: baseCharge.charges[0].amount,
      },
    }

    // TODO: handle error? retry?
    const chargeResponse = await this.paymentApi.createCharge(charge)

    return {
      success: !!(chargeResponse.receptionID && chargeResponse.user4),
      returnUrl: this.makePaymentUrl(chargeResponse.user4),
    }
  }
}
