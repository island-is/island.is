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
import { coreErrorMessages, getSlugFromType } from '@island.is/application/core'
import { CreateChargeResult } from './types/CreateChargeResult'

import {
  Application as ApplicationModel,
  ApplicationService,
} from '@island.is/application/api/core'
import { PaymentModuleConfig } from './payment.config'
import { ConfigType } from '@nestjs/config'
import { formatCharge } from './types/Charge'
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
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

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
    private readonly featureFlagService: FeatureFlagService,
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
    const isIslandisPaymentEnabled = await this.featureFlagService.getValue(
      Features.useIslandisPaymentForApplicationSystem,
      false,
      user,
    )
    if (isIslandisPaymentEnabled) {
      return this.getStatusIslandis(user, applicationId)
    } else {
      return this.getStatusArk(user, applicationId)
    }
  }

  /**
   * Retrieves the payment status for an Íslandis payment by application ID.
   *
   * @async
   * @param {User} user - The user requesting the payment status
   * @param {string} applicationId - The ID of the application to check payment status for
   *
   * @returns {Promise<PaymentStatus>} Object containing:
   *   - fulfilled: boolean indicating if payment is complete
   *   - paymentUrl: URL for the payment
   *   - paymentId: ID of the payment record
   *
   * @throws {NotFoundException} If no payment record exists for the given application ID
   */
  async getStatusIslandis(
    user: User,
    applicationId: string,
  ): Promise<PaymentStatus> {
    const foundPayment = await this.findPaymentByApplicationId(applicationId)
    if (!foundPayment) {
      throw new NotFoundException(
        `payment object was not found for application id ${applicationId}`,
      )
    }

    if (foundPayment.user4 === 'mockuser4') {
      this.logger.info(
        'foundPayment.user4 is mockuser4 meaning this is a mocked payment',
      )
      this.logger.info('forwarding payment to ark code for handling')
      return this.getStatusArk(user, applicationId)
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

  /**
   * Retrieves the payment status for an Ark payment by application ID and generates payment URL.
   *
   * @async
   * @param {User} user - The user requesting the payment status
   * @param {string} applicationId - The ID of the application to check payment status for
   *
   * @returns {Promise<PaymentStatus>} Object containing:
   *   - fulfilled: boolean indicating if payment is complete
   *   - paymentUrl: Generated delegation payment URL with callback
   *   - paymentId: ID of the payment record
   *
   * @throws {NotFoundException} If:
   *   - No payment record exists for the given application ID
   *   - Application type ID is not found
   * @throws {InternalServerErrorException} If payment record exists but user4 field is not set
   *
   * @remarks
   * The function:
   * 1. Validates payment record exists and has required user4 field
   * 2. Retrieves application details to get application type
   * 3. Generates a callback URL using application slug
   * 4. Creates a delegation payment URL with user information
   */
  async getStatusArk(
    user: User,
    applicationId: string,
  ): Promise<PaymentStatus> {
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

  async createCharge(
    user: User,
    performingOrganizationID: string,
    chargeItems: BasicChargeItem[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
    locale?: string | undefined,
  ) {
    const isIslandisPaymentEnabled = await this.featureFlagService.getValue(
      Features.useIslandisPaymentForApplicationSystem,
      false,
      user,
    )
    if (isIslandisPaymentEnabled) {
      return this.islandisCreateCharge(
        user,
        performingOrganizationID,
        chargeItems,
        applicationId,
        extraData,
        locale,
      )
    } else {
      return this.arkCreateCharge(
        user,
        performingOrganizationID,
        chargeItems,
        applicationId,
        extraData,
      )
    }
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
  async islandisCreateCharge(
    user: User,
    performingOrganizationID: string,
    chargeItems: BasicChargeItem[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
    locale?: string | undefined,
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
          payerNationalId: user.nationalId,
          organisationId: performingOrganizationID,
          onUpdateUrl: onUpdateUrl.toString(),
          metadata: {
            applicationId,
            paymentId: paymentModel.id,
          },
          returnUrl: await this.getReturnUrl(applicationId),
          redirectToReturnUrlOnSuccess: true,
          extraData,
          chargeItemSubjectId: paymentModel.id.substring(0, 22), // chargeItemSubjectId has maxlength of 22 characters
        },
      })
    paymentUrl =
      locale && locale === 'en'
        ? paymentFlowUrls.urls.en
        : paymentFlowUrls.urls.is

    await this.addPaymentUrl(applicationId, paymentModel.id, paymentUrl)
    await paymentModel.reload()

    // Update payment with a fixed user4 since services-payments does not need it
    await this.setUser4(applicationId, paymentModel.id, 'user4')
    this.auditPaymentCreation(user, applicationId, paymentModel.id)

    return {
      id: paymentModel.id,
      paymentUrl,
    }
  }

  /**
   * Builds a Charge object for the payment API endpoint and sends to FJS
   * Saves the user4 from the response to the payment db entry
   * @param payment
   * @param user
   * @returns Charge response result and a new payment callback Url
   */
  async arkCreateCharge(
    user: User,
    performingOrganizationID: string,
    chargeItems: BasicChargeItem[],
    applicationId: string,
    extraData: ExtraData[] | undefined,
  ): Promise<CreateChargeResult> {
    //1. Retrieve charge items from FJS
    const catalogChargeItems = await this.findCatalogChargeItems(
      performingOrganizationID,
      chargeItems,
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
        catalogChargeItems,
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

    const returnUrl = new URL(this.config.clientLocationOrigin)
    returnUrl.pathname = `umsoknir/${applicationSlug}/${applicationId}`
    returnUrl.search = 'done'

    return returnUrl.toString()
  }
}
