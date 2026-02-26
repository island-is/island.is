import { Inject, Injectable, NotFoundException } from '@nestjs/common'
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
    applicationId: string,
  ): Promise<void> {
    try {
      await this.paymentModel.update(
        {
          fulfilled: true,
          reference_id: null,
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

  async addPaymentUrlAndRequestId(
    applicationId: string,
    paymentId: string,
    paymentUrl: string,
    requestId: string,
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
        request_id: requestId,
      },
      {
        where: {
          id: paymentId,
          application_id: applicationId,
        },
      },
    )
  }

  /**
   * Retrieves the payment status for an Íslandis payment by application ID.
   *
   * @async
   * @param {string} applicationId - The ID of the application to check payment status for
   *
   * @returns {Promise<PaymentStatus>} Object containing:
   *   - fulfilled: boolean indicating if payment is complete
   *   - paymentUrl: URL for the payment
   *   - paymentId: ID of the payment record
   *
   * @throws {NotFoundException} If no payment record exists for the given application ID
   */
  async getStatus(applicationId: string): Promise<PaymentStatus> {
    const foundPayment = await this.findPaymentByApplicationId(applicationId)
    if (!foundPayment) {
      throw new NotFoundException(
        `payment object was not found for application id ${applicationId}`,
      )
    }

    if (foundPayment.user4 === 'mockuser4') {
      this.logger.info(
        'foundPayment.user4 is mockuser4 meaning this is a mocked payment, returning mock payment status',
      )
      return {
        fulfilled: foundPayment.fulfilled || false,
        paymentUrl: 'fakeurl',
        paymentId: foundPayment.id,
      }
    }

    const paymentUrl: string = JSON.parse(
      foundPayment.dataValues.definition,
    ).paymentUrl

    return {
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
      | 'application_id'
      | 'fulfilled'
      | 'amount'
      | 'definition'
      | 'expires_at'
      | 'request_id'
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
      request_id: '', // request_id is not set here, it is set once the requestId has been returned by the payment system
      // the requestId is the ID of the created charge in FJS which must be used when deleting a charge
    }
    return await this.paymentModel.create(paymentModel)
  }

  /**
   * Creates a payment charge through the Íslandis payment system. If a payment already exists
   * for the given application, returns the existing payment URL. Otherwise, creates a new
   * payment entry and generates a payment URL.
   *
   * @async
   * @param {User} user - The user initiating the payment
   * @param {string} performingOrganizationID - The ID of the organization performing the service
   * @param {BasicChargeItem[]} chargeItems - Array of items to be charged
   * @param {string} applicationId - The ID of the application associated with this payment
   * @param {ExtraData[] | undefined} extraData - Optional additional data for the payment
   * @param {string | undefined} locale - Optional locale setting ('en' or 'is') for the payment URL
   *
   * @returns {Promise<CreateChargeResult>} Object containing payment URLs and related information
   *
   * @throws {Error} If there's an error retrieving catalog charge items or creating the payment
   *
   * @remarks
   * The function performs the following steps:
   * 1. Retrieves charge items from FJS using the performing organization ID
   * 2. Checks for existing payment for the application
   * 3. If payment exists, returns existing payment URL
   * 4. If no payment exists, creates new payment entry and generates payment URL
   */
  async createCharge(
    user: User,
    performingOrganizationID: string,
    chargeItems: BasicChargeItem[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
    locale?: string | undefined,
    payerNationalId?: string,
  ): Promise<CreateChargeResult> {
    // Retrieve charge items from FJS
    const catalogChargeItems = await this.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
    ).then((catalogChargeItems) => {
      return catalogChargeItems.map((catalogChargeItem, i) => {
        // If the price is dynamic, we need to update the price of the
        // catalogChargeItems with the price from the chargeItems
        return {
          ...catalogChargeItem,
          priceAmount: chargeItems[i].amount ?? catalogChargeItem.priceAmount,
        }
      })
    })

    //2. Fetch existing payment if any
    let paymentModel = await this.findPaymentByApplicationId(applicationId)
    let paymentUrl = ''

    if (!paymentModel) {
      // payment Model does not exist so we need to create a new one and store it in the payment model variable
      paymentModel = await this.createPaymentModel(
        catalogChargeItems,
        applicationId,
        performingOrganizationID,
      )
    } else {
      // payment model already exists so we need to check if a flow was created
      paymentUrl = JSON.parse(paymentModel.dataValues.definition).paymentUrl
      if (paymentUrl) {
        // payment url is set, meaning a flow was created so we can use that
        return {
          id: paymentModel.id,
          paymentUrl,
        }
      }
    }
    // no model existed orpayment url was not set, meaning no flow was created so we need to create a new one
    const onUpdateUrl = new URL(this.config.paymentApiCallbackUrl)
    onUpdateUrl.pathname = '/application-payment/api-client-payment-callback'

    const { returnUrl, cancelUrl } = await this.getReturnUrls(applicationId)

    const resolvedPayerNationalId =
      payerNationalId && payerNationalId.trim().length > 0
        ? payerNationalId
        : user.nationalId

    const paymentFlowUrls =
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
          payerNationalId: resolvedPayerNationalId,
          organisationId: performingOrganizationID,
          onUpdateUrl: onUpdateUrl.toString(),
          metadata: {
            applicationId,
            paymentId: paymentModel.id,
          },
          returnUrl,
          cancelUrl,
          redirectToReturnUrlOnSuccess: true,
          extraData,
          chargeItemSubjectId: paymentModel.id.substring(0, 22), // chargeItemSubjectId has maxlength of 22 characters
        },
      })
    paymentUrl =
      locale && locale === 'en'
        ? paymentFlowUrls.urls.en
        : paymentFlowUrls.urls.is

    await this.addPaymentUrlAndRequestId(
      applicationId,
      paymentModel.id,
      paymentUrl,
      paymentFlowUrls.id,
    )
    await paymentModel.reload()

    // Update payment with a fixed user4 since services-payments does not need it
    await this.setUser4(applicationId, paymentModel.id, 'user4')
    this.auditPaymentCreation(user, applicationId, paymentModel.id)

    return {
      id: paymentModel.id,
      paymentUrl,
    }
  }

  async refundPayment(
    applicationId: string,
    reasonForRefund?: string,
  ): Promise<void> {
    const payment = await this.findPaymentByApplicationId(applicationId)
    if (!payment) {
      throw new NotFoundException(
        `payment was not found for application id ${applicationId}`,
      )
    }
    if (!payment.request_id) {
      throw new Error('Request ID is not set for payment')
    }

    try {
      await this.paymentsApi.cardPaymentControllerRefund({
        refundCardPaymentInput: {
          paymentFlowId: payment.request_id,
          reasonForRefund,
        },
      })
    } catch (error) {
      this.logger.error(
        `Failed to refund payment for application ${applicationId}`,
        error,
      )
      throw error
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
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg({
        performingOrgID: performingOrganizationID,
      })

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

  private async getReturnUrls(applicationId: string) {
    const application = await this.applicationService.findOneById(applicationId)

    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${applicationId}`,
      )
    }

    const returnUrl = new URL(this.config.clientLocationOrigin)
    returnUrl.pathname = `umsoknir/${applicationSlug}/${applicationId}`
    returnUrl.search = 'done'

    const cancelUrl = new URL(this.config.clientLocationOrigin)
    cancelUrl.pathname = `umsoknir/${applicationSlug}/${applicationId}`
    cancelUrl.search = 'cancelled'

    return { returnUrl: returnUrl.toString(), cancelUrl: cancelUrl.toString() }
  }
}
