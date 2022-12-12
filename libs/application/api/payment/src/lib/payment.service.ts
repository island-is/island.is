import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'
import { PaymentAPI } from '@island.is/clients/payment'
import type { Charge, Item as ChargeItem } from '@island.is/clients/payment'
import { User } from '@island.is/auth-nest-tools'
import { CreateChargeResult } from './payment.type'

import { Application as ApplicationModel } from '@island.is/application/api/core'
import { PaymentModuleConfig } from './payment.config'
import { ConfigType } from '@nestjs/config'
import { formatCharge } from './models/Charge'
import { PaymentType as BasePayment } from '@island.is/application/types'
import { AuditService } from '@island.is/nest/audit'
import { PaymentStatus } from './models/paymentStatus'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(PaymentModuleConfig.KEY)
    private config: ConfigType<typeof PaymentModuleConfig>,
    private paymentApi: PaymentAPI,
    private readonly auditService: AuditService,
  ) {}

  async findPaymentByApplicationId(
    applicationId: string,
  ): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: applicationId,
      },
    })
  }

  async getStatus(applicationId: string): Promise<PaymentStatus> {
    const foundPayment = await this.findPaymentByApplicationId(applicationId)
    if (!foundPayment) {
      throw new NotFoundException(
        `payment object was not found for application id ${applicationId}`,
      )
    }

    if (!foundPayment.user4) {
      throw new InternalServerErrorException(
        `valid payment object was not found for application id ${applicationId} - user4 not set`,
      )
    }
    return {
      fulfilled: foundPayment.fulfilled || false,
      paymentUrl: this.makePaymentUrl(foundPayment.user4),
    }
  }

  public makePaymentUrl(docNum: string): string {
    return `${this.config.arkBaseUrl}/quickpay/pay?doc_num=${docNum}`
  }

  private async createPaymentModel(
    chargeItems: ChargeItem[],
    applicationId: string,
  ): Promise<Payment> {
    const paymentModel: Pick<
      BasePayment,
      'application_id' | 'fulfilled' | 'amount' | 'definition' | 'expires_at'
    > = {
      application_id: applicationId,
      fulfilled: false,
      amount: chargeItems.reduce(
        (sum, item) => sum + (item?.priceAmount || 0),
        0,
      ),
      definition: {
        performingOrganizationID: chargeItems[0].performingOrgID,
        chargeType: chargeItems[0].chargeType,
        charges: chargeItems.map((chargeItem) => ({
          chargeItemName: chargeItem.chargeItemName,
          chargeItemCode: chargeItem.chargeItemCode,
          amount: chargeItem.priceAmount,
        })),
      },
      expires_at: new Date(),
    }
    return await this.paymentModel.create(paymentModel)
  }

  /**
   * Builds a Charge object for the payment API endpoint and sends to FJS
   * Saves the user4 from the response to the payment db entry
   * @param payment
   * @param user
   * @returns Charge response result and a new payment callback Url
   */
  async createCharge(
    user: User,
    chargeItemCodes: string[],
    applicationId: string,
  ): Promise<CreateChargeResult> {
    //.1 Get charge items from FJS
    const chargeItems = await this.findChargeItems(chargeItemCodes)

    //2. Create and insert payment db entry
    const paymentModel = await this.createPaymentModel(
      chargeItems,
      applicationId,
    )

    //3. Send charge to FJS
    const chargeResult = await this.paymentApi.createCharge(
      formatCharge(
        paymentModel,
        this.config.callbackBaseUrl,
        this.config.callbackAdditionUrl,
        user,
      ),
    )

    //4. update payment with user4 from charge result
    await this.paymentModel.update(
      {
        user4: chargeResult.user4,
      },
      {
        where: {
          id: paymentModel.id,
          application_id: applicationId,
        },
      },
    )

    this.auditService.audit({
      auth: user,
      action: 'createCharge',
      resources: applicationId as string,
      meta: { applicationId, id: paymentModel.id },
    })

    return {
      id: paymentModel.id,
      paymentUrl: this.makePaymentUrl(chargeResult.user4),
    }
  }

  async findChargeItem(targetChargeItemCode: string): Promise<ChargeItem> {
    const { item: items } = await this.paymentApi.getCatalog()

    const item = items.find(
      ({ chargeItemCode }) => chargeItemCode === targetChargeItemCode,
    )

    if (!item) {
      throw new Error('Bad chargeItemCode or empty catalog')
    }

    return item
  }

  async findChargeItems(
    targetChargeItemCodes: string[],
  ): Promise<ChargeItem[]> {
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
