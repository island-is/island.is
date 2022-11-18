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
import { User } from '@island.is/auth-nest-tools'
import { CreateChargeResult } from './payment.type'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Application as ApplicationModel } from '@island.is/application/api/core'

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
          application_id: applicationId,
        },
      })
      .catch(handleError)
  }

  public makePaymentUrl(docNum: string): string {
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

    const parsedDefinition = JSON.parse(
      (payment.definition as unknown) as string,
    )
    const parsedDefinitionCharges = parsedDefinition.charges as [
      {
        chargeItemName: string
        chargeItemCode: string
        amount: number
      },
    ]

    const charge: Charge = {
      // TODO: this needs to be unique, but can only handle 22 or 23 chars
      // should probably be an id or token from the DB charge once implemented
      chargeItemSubject: payment.id.substring(0, 22),
      systemID: 'ISL',
      // The OR values can be removed later when the system will be more robust.
      performingOrgID: parsedDefinition.performingOrganizationID,
      payeeNationalID: user.nationalId,
      chargeType: parsedDefinition.chargeType,
      performerNationalID: user.nationalId,
      charges: parsedDefinitionCharges.map((parsedDefinitionCharge) => ({
        chargeItemCode: parsedDefinitionCharge.chargeItemCode,
        quantity: 1,
        priceAmount: parsedDefinitionCharge.amount,
        amount: parsedDefinitionCharge.amount,
        reference: '',
      })),
      immediateProcess: true,
      returnUrl: callbackUrl,
      requestID: payment.id,
    }

    const result = await this.paymentApi.createCharge(charge)

    return {
      ...result,
      paymentUrl: this.makePaymentUrl(result.user4),
    }
  }

  async findChargeItem(targetChargeItemCode: string): Promise<Item> {
    const { item: items } = await this.paymentApi.getCatalog()

    const item = items.find(
      ({ chargeItemCode }) => chargeItemCode === targetChargeItemCode,
    )

    if (!item) {
      throw new Error('Bad chargeItemCode or empty catalog')
    }

    return item
  }

  async findChargeItems(targetChargeItemCodes: string[]): Promise<Item[]> {
    const { item: allItems } = await this.paymentApi.getCatalog()

    const items = allItems.filter(({ chargeItemCode }) =>
      targetChargeItemCodes.includes(chargeItemCode),
    )

    if (!items || items.length === 0) {
      throw new Error('Bad chargeItemCodes or empty catalog')
    }

    const firstItem = items[0]
    const notSame = items.find(
      (item) =>
        item.performingOrgID !== firstItem.performingOrgID ||
        item.chargeType !== firstItem.chargeType,
    )
    if (notSame) {
      throw new Error(
        'Not all chargeItemCodes have the same performingOrgID or chargeType',
      )
    }

    return items
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

  async delete(applicationId: string, user: User) {
    const { nationalId } = user
    const application = await ApplicationModel.findOne({
      where: {
        id: applicationId,
        [Op.or]: [
          { applicant: nationalId },
          { assignees: { [Op.contains]: [nationalId] } },
        ],
      },
    })

    // Make sure applicationId belongs to CurrentUser
    if (!application || application.id !== applicationId) {
      return
    }

    return this.paymentModel.destroy({
      where: {
        application_id: applicationId,
      },
    })
  }
}
