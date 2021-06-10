import { Injectable } from '@nestjs/common'
import { Charge, PaymentAPI } from '@island.is/clients/payment'
import { ChargeResult } from './api-domains-payment.types'
<<<<<<< HEAD

@Injectable()
export class ApiDomainsPaymentService {
=======
import { application } from 'express'

@Injectable()
export class PaymentService {
>>>>>>> feature/driving-license-demo
  private baseUrl: string

  constructor(private readonly paymentApi: PaymentAPI) {
    this.baseUrl = 'https://uat.arkid.is'
  }

  private makePaymentUrl(docNum: string, returnUrl: string): string {
<<<<<<< HEAD
    return `${this.baseUrl}/quickpay/document/pay`
=======
    return `${this.baseUrl}/quickpay/pay`
>>>>>>> feature/driving-license-demo
      + `?returnUrl=${encodeURIComponent(returnUrl)}`
      + `&doc_num=${docNum}`
  }

<<<<<<< HEAD
  async createCharge(chargeParameters: Charge): Promise<ChargeResult> {
    console.log('apidomainssvc ' + JSON.stringify(chargeParameters, null, 4));
    try {
      console.log('inside try')
      const charge = await this.paymentApi.createCharge(chargeParameters)
      console.log(JSON.stringify(charge, null, 4));
=======
  async createCharge(chargeParameters: Charge, returnUrl: string): Promise<ChargeResult> {
    try {
      const charge = await this.paymentApi.createCharge(chargeParameters)

>>>>>>> feature/driving-license-demo
      return {
        success: true,
        error: null,
        data: {
          ...charge,
<<<<<<< HEAD
          paymentUrl: this.makePaymentUrl(charge.user4, 'http://localhost:4200/umsoknir/okuskirteini/')
=======
          paymentUrl: this.makePaymentUrl(charge.user4, returnUrl)
>>>>>>> feature/driving-license-demo
        },
      }
    } catch (e) {
      return {
        success: false,
<<<<<<< HEAD
        error: e as Error,
=======
        error: e,
>>>>>>> feature/driving-license-demo
      }
    }
  }
}
