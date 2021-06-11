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
import { Op } from 'sequelize'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(ApiDomainsPaymentService)
    private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createPayment(charge: Charge, returnUrl: string, applicationId: string): Promise<ChargeResult> {
    try {
      const result = await this.apiDomainsPaymentService.createCharge(charge, returnUrl)

      // Calculate current time plus 48 hours. 86.400.000 is seconds in a day, 172.800.000 is two days.
      let calcExpiration = new Date().getTime() + 172800000
      console.log('The expiration date of payment application: ' + new Date(calcExpiration))
      console.log('payment service')
      console.log(JSON.stringify(charge, null, 4));
      console.log(JSON.stringify(result, null, 4));
      const paymentDto = {
        application_id: applicationId,
        fulfilled: false,
        user4: result.data?.paymentUrl as string,
        definition: charge.chargeItemSubject,
        amount: charge.payInfo?.payableAmount || 0,
        expires_at: new Date(calcExpiration),
        reference_id: result.data?.receptionID
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

  async findPaymentByApplicationId(
    applicationId: string,
    id?: string,
  ): Promise<Payment[]> {
    const applicationIds = applicationId?.split(',')
    const ids = id?.split(',')

    return this.paymentModel.findAll({
      where: {
        ...(applicationIds ? { applicationId: { [Op.in]: applicationIds } } : {}),
        ...(ids ? { id: { [Op.in]: ids } } : {}),
      },
      order: [['modified', 'DESC']],
    })
  }

  async assignValues(id:string, applicationId: string, isPaid: boolean, payment: Payment): Promise<CreatePaymentResponseDto> {
    const assignedObject: CreatePaymentResponseDto = {
      id: id || payment.id,
      application_id: applicationId || payment.application_id,
      fulfilled: isPaid,
      user4: payment.user4 || '',
      amount: payment.amount || 0,
      definition: payment.definition || 'Updated is fulfilled column.',
      expires_at: payment.expires_at || new Date(),
    }
    return Promise.resolve(assignedObject)
  }

  async findCorrectApplicationPayment(paymentRows:Payment[]): Promise<Payment> {
    let filteredPayment: Payment = paymentRows[0]
    for(const payment in paymentRows){
      if(paymentRows[payment].fulfilled === true){
        return paymentRows[payment]
      }
      console.log('paymentrows '+[payment] + '  ' + paymentRows[payment].createdAt.getTime())
      if(paymentRows[payment].createdAt.getTime() > filteredPayment.createdAt.getTime()){
        filteredPayment = paymentRows[payment]
      }
    }
    return filteredPayment
  }

  // async approvePayment(callback: Callback, applicationId: string, charge: Charge): Promise<CallbackResult> {
  //   if(callback?.status === 'paid') {
  //     const paidApplication:CallbackResult = {
  //       success: true,
  //       error: null,
  //       data: {
  //         ...callback
  //       }
  //     }
  //     const paymentDto = {
  //       application_id: applicationId,
  //       fulfilled: true,
  //       user4: charge.returnUrl || "",
  //       reference_id: callback.receptionID,
  //       definition: `This application is paid - ${callback.chargeItemSubject}`,
  //       amount: charge.payInfo?.payableAmount || 0,
  //       expires_at: new Date(),
  //     }
  //     this.paymentModel.create(paymentDto)
  //     return paidApplication
  //   } else {
  //     const err:Error["stack"] = 'Payment callback returned unpaid.'
  //     const unpaid:CallbackResult = {
  //       success: false,
  //       error: err,
  //     }
  //     return unpaid
  //   }
  // }
}
