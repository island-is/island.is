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
import {
  PaymentType as BasePayment,
  BasicChargeItem,
} from '@island.is/application/types'
import { AuditService } from '@island.is/nest/audit'
import { PaymentStatus } from './types/paymentStatus'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CreatePaymentFlowInputAvailablePaymentMethodsEnum,
  PaymentsApi,
} from '@island.is/clients/payments'
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
    private readonly paymentsApi: PaymentsApi,
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

  async addPaymentUrl(
    applicationId: string,
    paymentId: string,
    paymentUrl: string,
  ): Promise<void> {
    const payment = await this.findPaymentByApplicationId(applicationId)
    const definition = JSON.parse(
      (payment?.definition as unknown as string) ?? '{}', // definition is a JSONB field so it is returned as a string
    )
    await this.paymentModel.update(
      {
        definition: {
          ...definition,
          paymentUrl: paymentUrl,
        },
      },
      {
        where: {
          id: paymentId,
          application_id: applicationId,
        },
      },
    )
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

    const paymentUrl = JSON.parse(foundPayment.dataValues.definition).paymentUrl
    return {
      // TODO: maybe treat the case where no payment was found differently?
      // not sure how/if that case would/could come up.
      fulfilled: foundPayment.fulfilled || false,
      paymentUrl,
      paymentId: foundPayment.id,
    }
  }

  async setUser4(
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
    catalogChargeItems: CatalogItem[],
    applicationId: string,
    performingOrganizationID: string,
  ): Promise<Payment> {
    const paymentModel: Pick<
      BasePayment,
      'application_id' | 'fulfilled' | 'amount' | 'definition' | 'expires_at'
    > = {
      application_id: applicationId,
      fulfilled: false,
      amount: catalogChargeItems.reduce(
        (sum, item) => sum + (item?.priceAmount || 0) * (item?.quantity || 1),
        0,
      ),
      definition: {
        performingOrganizationID: performingOrganizationID,
        chargeType: catalogChargeItems[0].chargeType,
        charges: catalogChargeItems.map((chargeItem) => ({
          chargeItemName: chargeItem.chargeItemName,
          chargeItemCode: chargeItem.chargeItemCode,
          amount: chargeItem.priceAmount, // Note: this field should be called priceAmount (since it is not summarized)
          quantity: chargeItem.quantity,
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
    chargeItems: BasicChargeItem[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
    locale?: string | undefined,
  ): Promise<CreateChargeResult> {
    console.log('=========================================')
    console.log('chargeItems')
    console.dir(chargeItems, { depth: null })
    console.log('=========================================')
    console.log('extraData')
    console.dir(extraData, { depth: null })
    console.log('=========================================')

    //1. Retrieve charge items from FJS
    const catalogChargeItems = await this.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    )
    console.log('=========================================')
    console.log('catalogChargeItems')
    console.dir(catalogChargeItems, { depth: null })
    console.log('=========================================')

    //2. Fetch existing payment if any
    let paymentModel = await this.findPaymentByApplicationId(applicationId)
    let paymentUrl = ''

    if (paymentModel) {
      //payment Model already exists something has previously gone wrong.

      console.log('=========================================')
      console.log('paymentModel EXISTS')
      console.dir(paymentModel, { depth: null })
      console.log('=========================================')

      paymentUrl = JSON.parse(paymentModel.dataValues.definition).paymentUrl
    } else {
      //3. Create new payment entry
      paymentModel = await this.createPaymentModel(
        catalogChargeItems,
        applicationId,
        performingOrganizationID,
      )

      const paymentResult =
        await this.paymentsApi.paymentFlowControllerCreatePaymentUrl({
          createPaymentFlowInput: {
            availablePaymentMethods: [
              CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
            ],
            charges: catalogChargeItems.map((chargeItem) => ({
              chargeType: chargeItem.chargeType,
              chargeItemCode: chargeItem.chargeItemCode,
              quantity: chargeItem.quantity ?? 1,
              price: chargeItem.priceAmount,
            })),
            payerNationalId: user.nationalId,
            organisationId: performingOrganizationID,
            onUpdateUrl:
              'http://localhost:3333/application-payment/api-client-payment-callback/',
            metadata: {
              applicationId,
              paymentId: paymentModel.id,
            },
            returnUrl: await this.getReturnUrl(applicationId),
          },
        })

      console.log('=========================================')
      console.log('paymentResult')
      console.dir(paymentResult, { depth: null })
      console.log('=========================================')

      paymentUrl =
        locale && locale === 'en'
          ? paymentResult.urls.en
          : paymentResult.urls.is

      await this.addPaymentUrl(applicationId, paymentModel.id, paymentUrl)
      await paymentModel.reload()
    }

    //5. Update payment with user4 from charge result

    await this.setUser4(applicationId, paymentModel.id, 'user4')
    this.auditPaymentCreation(user, applicationId, paymentModel.id)

    console.log('=========================================')
    console.log('paymentModel')
    console.dir(paymentModel, { depth: null })
    console.log('=========================================')

    return {
      id: paymentModel.id,
      paymentUrl,
    }
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

  async findCatalogChargeItems(
    performingOrganizationID: string,
    targetChargeItems: BasicChargeItem[],
  ): Promise<CatalogItem[]> {
    const { item: catalogItems } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
        performingOrganizationID,
      )

    // get list of items with catalog info, but make sure to allow duplicates
    const result: CatalogItem[] = []
    for (let i = 0; i < targetChargeItems.length; i++) {
      const chargeItem = targetChargeItems[i]
      const catalogItem = catalogItems.find(
        (item) => item.chargeItemCode === chargeItem.code,
      )
      if (catalogItem) {
        result.push({ ...catalogItem, quantity: chargeItem.quantity })
      }
    }

    if (!result || result.length === 0) {
      throw new Error('Bad chargeItems or empty catalog')
    }

    const firstItem = result[0]
    const notSame = result.find(
      (item) => item.chargeType !== firstItem.chargeType,
    )
    if (notSame) {
      throw new Error('Not all chargeItems have the same chargeType')
    }

    return result
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

  private async getReturnUrl(applicationId: string) {
    const application = await this.applicationService.findOneById(applicationId)

    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${applicationId}`,
      )
    }

    // return `${this.config.clientLocationOrigin}/${applicationSlug}/${applicationId}?done`
    return `https://as-test-new-payment-beta.dev01.devland.is/umsoknir/greida/${applicationId}?done`
  }
}
