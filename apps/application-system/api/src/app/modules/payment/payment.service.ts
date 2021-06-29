import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'
import { PaymentAPI, PAYMENT_OPTIONS } from '@island.is/clients/payment'
import type {
  Charge,
  PaymentServiceOptions,
  Item,
} from '@island.is/clients/payment'
import type { User } from '@island.is/auth-nest-tools'
import { CreateChargeResult } from './payment.type'
import isEqual from 'lodash'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'

const handleError = async (error: any) => {
  logger.error(JSON.stringify(error))

  if (error.json) {
    const json = await error.json()

    logger.error(json)

    throw new ApolloError(JSON.stringify(json), error.status)
  }

  throw new ApolloError('Failed to resolve request', error.status)
}

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
    return this.paymentModel
      .findOne({
        where: {
          application_id: { [Op.eq]: applicationId },
        },
        limit: 1,
        order: [['modified', 'DESC']],
      })
      .catch(handleError)
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
    // payment definition needs refactoring so E2E tests work.
    const paymentDefinition = JSON.parse(payment.definition as string)
    const charge: Charge = {
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: payment.id.substring(0, 22),
      systemID: 'ISL',
      // The OR values can be removed later when the system will be more robust.
      performingOrgID:
        paymentDefinition?.performingOrganizationID || '6509142520',
      payeeNationalID: user.nationalId,
      chargeType: paymentDefinition?.chargeType || 'AY1',
      performerNationalID: user.nationalId,
      charges: [
        {
          chargeItemCode: paymentDefinition?.chargeItemCode || 'AY110',
          quantity: 1,
          priceAmount: payment.amount,
          amount: payment.amount,
          reference: '',
        },
      ],
      immediateProcess: true,
      returnUrl: callbackUrl,
    }
    const result = await this.paymentApi.createCharge(charge).catch(handleError)
    return {
      ...result,
      paymentUrl: this.makePaymentUrl(result.user4),
    }
  }

  async searchCorrectCatalog(
    chargeItemCode: string,
    searchJSON: string,
  ): Promise<Item> {
    if (chargeItemCode === '' || searchJSON === '') {
      return Promise.reject(new Error('Bad search catalog parameters.')).catch(
        handleError,
      )
    }
    const resultCatalog = JSON.parse(searchJSON)
    for (const item in resultCatalog) {
      if (isEqual(resultCatalog[item].chargeItemCode, chargeItemCode)) {
        return Promise.resolve(resultCatalog[item])
      }
    }
    return Promise.reject(
      new Error('No catalog found with ' + chargeItemCode),
    ).catch(handleError)
  }
}
