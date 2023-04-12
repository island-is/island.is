import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'
import {
  CatalogItem,
  ChargeFjsV2ClientService,
  ExtraData,
} from '@island.is/clients/charge-fjs-v2'
import { User } from '@island.is/auth-nest-tools'
import { getSlugFromType } from '@island.is/application/core'
import { CreateChargeResult } from './types/CreateChargeResult'

import {
  Application as ApplicationModel,
  ApplicationService,
} from '@island.is/application/api/core'
import { PaymentModuleConfig } from './payment.config'
import { ConfigType } from '@nestjs/config'
import { formatCharge } from './types/Charge'
import { PaymentType as BasePayment } from '@island.is/application/types'
import { AuditService } from '@island.is/nest/audit'
import { PaymentStatus } from './types/paymentStatus'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @Inject(PaymentModuleConfig.KEY)
    private config: ConfigType<typeof PaymentModuleConfig>,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly auditService: AuditService,
    private readonly applicationService: ApplicationService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
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

  async fulfillPayment(
    paymentId: string,
    receptionID: string,
    applicationId: string,
  ): Promise<void> {
    try {
      await this.paymentModel.update(
        {
          fulfilled: true,
          reference_id: receptionID,
        },
        {
          where: {
            id: paymentId,
            application_id: applicationId,
          },
        },
      )
    } catch (e) {
      this.logger.error('Error fulfilling payment', e)
      throw e
    }
  }

  async getStatus(user: User, applicationId: string): Promise<PaymentStatus> {
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
    const application = await this.applicationService.findOneById(applicationId)

    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${applicationId}`,
      )
    }

    const callbackUrl = `${this.config.clientLocationOrigin}/${applicationSlug}/${applicationId}?done`

    return {
      // TODO: maybe treat the case where no payment was found differently?
      // not sure how/if that case would/could come up.
      fulfilled: foundPayment.fulfilled || false,
      paymentUrl: this.makeDelegationPaymentUrl(
        foundPayment.user4,
        user.sub ?? user.nationalId,
        callbackUrl,
      ),
      paymentId: foundPayment.id,
    }
  }

  public makePaymentUrl(docNum: string): string {
    return `${this.config.arkBaseUrl}/quickpay/pay?doc_num=${docNum}`
  }

  private async createPaymentModel(
    chargeItems: CatalogItem[],
    applicationId: string,
    performingOrganizationID: string,
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
        performingOrganizationID: performingOrganizationID,
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
    performingOrganizationID: string,
    chargeItemCodes: string[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
  ): Promise<CreateChargeResult> {
    try {
      //.1 Get charge items from FJS
      const chargeItems = await this.findChargeItems(
        performingOrganizationID,
        chargeItemCodes,
      )

      //2. Create and insert payment db entry
      const paymentModel = await this.createPaymentModel(
        chargeItems,
        applicationId,
        performingOrganizationID,
      )

      //3. Send charge to FJS
      const chargeResult = await this.chargeFjsV2ClientService.createCharge(
        formatCharge(
          paymentModel,
          this.config.callbackBaseUrl,
          this.config.callbackAdditionUrl,
          extraData,
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
    } catch (e) {
      this.logger.error('Error creating charge', e)
      throw new InternalServerErrorException('Error creating charge')
    }
  }

  public makeDelegationPaymentUrl(
    docNum: string,
    loginHint: string,
    callbackUrl: string,
  ): string {
    const targetLinkUri = `${this.makePaymentUrl(
      docNum,
    )}&returnURL=${callbackUrl}`

    return `${this.config.arkBaseUrl}/quickpay/pay?iss=${
      this.config.authIssuer
    }&login_hint=${loginHint}&target_link_uri=${encodeURIComponent(
      targetLinkUri,
    )}`
  }

  async findChargeItems(
    performingOrganizationID: string,
    targetChargeItemCodes: string[],
  ): Promise<CatalogItem[]> {
    const {
      item: allItems,
    } = await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
      performingOrganizationID,
    )

    // get list of items with catalog info, but make sure to allow duplicates
    const items: CatalogItem[] = []
    for (let i = 0; i < targetChargeItemCodes.length; i++) {
      const chargeItemCode = targetChargeItemCodes[i]
      const item = allItems.find(
        (item) => item.chargeItemCode === chargeItemCode,
      )
      if (item) {
        items.push(item)
      }
    }

    if (!items || items.length === 0) {
      throw new Error('Bad chargeItemCodes or empty catalog')
    }

    const firstItem = items[0]
    const notSame = items.find(
      (item) => item.chargeType !== firstItem.chargeType,
    )
    if (notSame) {
      throw new Error('Not all chargeItemCodes have the same chargeType')
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
