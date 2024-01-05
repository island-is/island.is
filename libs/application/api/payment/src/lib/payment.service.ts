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
  ChargeResponse,
  ChargeStatusResultStatusEnum,
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
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { coreErrorMessages } from '@island.is/application/core'

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

  private async setUser4(
    applicationId: string,
    paymentId: string,
    user4: string,
  ): Promise<void> {
    await this.paymentModel.update(
      {
        user4,
      },
      {
        where: {
          id: paymentId,
          application_id: applicationId,
        },
      },
    )
  }

  async createPaymentModel(
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
    //1. Retrieve charge items from FJS
    const chargeItems = await this.findChargeItems(
      performingOrganizationID,
      chargeItemCodes,
    )

    //2. Fetch existing payment if any
    let paymentModel = await this.findPaymentByApplicationId(applicationId)
    let user4 = ''

    if (paymentModel) {
      //payment Model already exists something has previously gone wrong.

      const chargeStatus = await this.chargeFjsV2ClientService.getChargeStatus(
        paymentModel.id,
      )

      const status = chargeStatus?.statusResult?.status

      if (chargeStatus === null) {
        //No charge present in FJS - we need to create a new one
        const chargeResult = await this.createNewCharge(
          paymentModel,
          user,
          extraData,
        )
        user4 = chargeResult.user4
      } else if (status === ChargeStatusResultStatusEnum.InProgress) {
        //Payment is still in progress - we need to wait for it to finish before we can continue.
        throw new ProblemError({
          type: ProblemType.TEMPLATE_API_ERROR,
          title: 'CreateCharge Payment still in progress.',
          errorReason: {
            title:
              coreErrorMessages.paymentCreateChargeFailedStillInProgressTitle,
            summary:
              coreErrorMessages.paymentCreateChargeFailedStillInProgressSummary,
          },
        })
      } else if (
        status === ChargeStatusResultStatusEnum.Unpaid &&
        chargeStatus.statusResult.docNum
      ) {
        //We aldready have a charge that is unpaid so we can proceed like normal
        //and update payment with user4 from charge result
        await this.setUser4(
          applicationId,
          paymentModel.id,
          chargeStatus.statusResult.docNum,
        )
        this.auditPaymentCreation(user, applicationId, paymentModel.id)
        return this.buildChargeResult(
          paymentModel.id,
          chargeStatus.statusResult.docNum,
        )
      }
      // update charge with new data if needed
    } else {
      //3. Create new payment entry
      paymentModel = await this.createPaymentModel(
        chargeItems,
        applicationId,
        performingOrganizationID,
      )

      //4. Create new charge
      const chargeResult = await this.createNewCharge(
        paymentModel,
        user,
        extraData,
      )
      user4 = chargeResult.user4
    }

    //5. Update payment with user4 from charge result
    await this.setUser4(applicationId, paymentModel.id, user4)
    this.auditPaymentCreation(user, applicationId, paymentModel.id)

    return this.buildChargeResult(paymentModel.id, user4)
  }

  async createNewCharge(
    paymentModel: Payment,
    user: User,
    extraData: ExtraData[] | undefined,
  ): Promise<ChargeResponse> {
    return await this.chargeFjsV2ClientService.createCharge(
      formatCharge(
        paymentModel,
        this.config.callbackBaseUrl,
        this.config.callbackAdditionUrl,
        extraData,
        user,
      ),
    )
  }

  private auditPaymentCreation(
    user: User,
    applicationId: string,
    paymentId: string,
  ) {
    return this.auditService.audit({
      auth: user,
      action: 'createCharge',
      resources: applicationId as string,
      meta: { applicationId, id: paymentId },
    })
  }

  private buildChargeResult(paymentId: string, user4: string) {
    return {
      id: paymentId,
      paymentUrl: this.makePaymentUrl(user4),
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
    const { item: allItems } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
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
