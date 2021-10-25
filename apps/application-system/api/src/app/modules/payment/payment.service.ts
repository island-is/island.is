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
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Application as ApplicationModel } from '../application/application.model'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

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

    try {
      const parsedDefinition = JSON.parse(
        (payment.definition as unknown) as string,
      )
      const charge: Charge = {
        // TODO: this needs to be unique, but can only handle 22 or 23 chars
        // should probably be an id or token from the DB charge once implemented
        chargeItemSubject: payment.id.substring(0, 22),
        systemID: 'ISL',
        // The OR values can be removed later when the system will be more robust.
        performingOrgID: parsedDefinition.performingOrganiationID,
        payeeNationalID: user.nationalId,
        chargeType: parsedDefinition.chargeType,
        performerNationalID: user.nationalId,
        charges: [
          {
            chargeItemCode: parsedDefinition.chargeItemCode,
            quantity: 1,
            priceAmount: payment.amount,
            amount: payment.amount,
            reference: '',
          },
        ],
        immediateProcess: true,
        returnUrl: callbackUrl,
        requestID: payment.id,
      }
      const result = await this.paymentApi.createCharge(charge)
      return {
        ...result,
        paymentUrl: this.makePaymentUrl(result.user4),
      }
    } catch (exception) {
      return Promise.reject('Failed to post charge to API. ' + exception)
    }
  }

  async searchCorrectCatalog(
    chargeItemCode: string,
    search: Item[],
  ): Promise<Item> {
    if (
      chargeItemCode === '' ||
      !Array.isArray(search) ||
      search.length === 0
    ) {
      return Promise.reject(new Error('Bad search catalog parameters.')).catch(
        handleError,
      )
    }
    // TODO: temp - This is only while payment dummy is being used/tested. Should be deleted later.
    if (!isRunningOnEnvironment('production') && chargeItemCode === 'AYXXX') {
      chargeItemCode = 'AY110'
    }

    for (const item in search) {
      if (search[item].chargeItemCode === chargeItemCode) {
        return Promise.resolve(search[item])
      }
    }
    return Promise.reject(
      new Error('No catalog found with ' + chargeItemCode),
    ).catch(handleError)
  }

  async findApplicationById(
    applicationId: string,
    nationalId: string,
    applicationType: string,
  ): Promise<ApplicationModel> {
    const application = await ApplicationModel.findAll({
      where: {
        id: applicationId,
        typeId: applicationType,
        [Op.or]: [
          { applicant: nationalId },
          { assignees: { [Op.contains]: [nationalId] } },
        ],
      },
    })
    if (!application) {
      Promise.reject('Failed to find application').catch()
    }
    return application[0] as ApplicationModel
  }
}
