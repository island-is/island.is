import {
  BadRequestException,
  Inject,
  Injectable,
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
  DebtInput,
  PaymentsApi,
  GetPaymentFlowStatusDTOPaymentStatusEnum,
} from '@island.is/clients/payments'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { FetchError } from '@island.is/clients/middlewares'

export enum PaymentMethod {
  CARD = 'card',
  INVOICE = 'invoice',
}

const DEBT_PAYMENT_TYPE = 'debt'

// TEXT in the database but JSONB in the model, so tests read an object
const parseDefinition = (payment: Payment): Record<string, unknown> => {
  const { definition } = payment.dataValues
  return typeof definition === 'string'
    ? JSON.parse(definition)
    : definition ?? {}
}

export const isDebtPayment = (payment: Payment): boolean =>
  parseDefinition(payment).type === DEBT_PAYMENT_TYPE

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

  private logError(
    errorString: string,
    applicationId: string,
    error: Error | FetchError | undefined,
  ) {
    this.logger.error(
      `${errorString} for application ${applicationId}: ${
        error instanceof FetchError
          ? error.problem?.detail
          : error?.message ?? 'Unknown error'
      }`,
    )
  }

  async findPaymentByApplicationId(
    applicationId: string,
  ): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: applicationId,
      },
    })
  }

  async findPaymentsByApplicationIds(
    applicationIds: string[],
  ): Promise<Payment[]> {
    return this.paymentModel.findAll({
      where: {
        application_id: { [Op.in]: applicationIds },
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
    const definition = payment ? parseDefinition(payment) : {}
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

    const definition = parseDefinition(foundPayment)
    const paymentUrl = definition.paymentUrl as string
    let fulfilled = foundPayment.fulfilled || false

    if (
      !fulfilled &&
      definition.type === DEBT_PAYMENT_TYPE &&
      !definition.rejected &&
      foundPayment.request_id
    ) {
      fulfilled = await this.reconcileDebtPayment(
        foundPayment,
        foundPayment.request_id,
      )
    }

    return {
      fulfilled,
      paymentUrl,
      paymentId: foundPayment.id,
    }
  }

  // services-payments does not redeliver a failed webhook
  private async reconcileDebtPayment(
    payment: Payment,
    paymentFlowId: string,
  ): Promise<boolean> {
    try {
      if (!(await this.isDebtPaymentPaid(paymentFlowId))) {
        return false
      }
    } catch (error) {
      this.logError(
        'Failed to read debt payment flow',
        payment.application_id,
        error,
      )
      return false
    }

    this.logger.warn(
      `Debt payment for application ${payment.application_id} is paid but no success callback arrived, fulfilling it`,
    )
    await this.fulfillPayment(payment.id, payment.application_id)

    return true
  }

  private async isDebtPaymentPaid(paymentFlowId: string): Promise<boolean> {
    const { paymentStatus } =
      await this.paymentsApi.paymentFlowControllerGetPaymentFlowStatus({
        id: paymentFlowId,
      })

    if (paymentStatus !== GetPaymentFlowStatusDTOPaymentStatusEnum.paid) {
      return false
    }

    // A bank transfer FJS rejected counts as paid until it is refunded by hand
    return !(await this.isDebtFlowClosed(paymentFlowId))
  }

  private async isDebtFlowClosed(paymentFlowId: string): Promise<boolean> {
    const { isClosed } =
      await this.paymentsApi.paymentFlowControllerGetPaymentFlow({
        id: paymentFlowId,
        includeEvents: false,
      })

    return isClosed
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
      | 'request_id'
      | 'payment_method'
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
      payment_method: PaymentMethod.CARD,
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

    const {
      returnUrl,
      cancelUrl,
      invoiceUrl: invoiceReturnUrl,
    } = await this.getReturnUrls(applicationId)

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
          invoiceReturnUrl,
          redirectToReturnUrlOnSuccess: true,
          redirectOnInvoiceCreation: true,
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

  async createDebtPayment(
    user: User,
    applicationId: string,
    debts: DebtInput[],
    locale?: string,
  ): Promise<CreateChargeResult> {
    const amount = debts.reduce((sum, debt) => sum + debt.amount, 0)
    const definition = { type: DEBT_PAYMENT_TYPE, debts }

    let paymentModel = await this.findPaymentByApplicationId(applicationId)

    if (!paymentModel) {
      paymentModel = await this.paymentModel.create({
        application_id: applicationId,
        fulfilled: false,
        amount,
        definition,
        payment_method: PaymentMethod.CARD,
        request_id: '',
      })
    } else {
      const { paymentUrl } = parseDefinition(paymentModel)
      if (paymentUrl) {
        return { id: paymentModel.id, paymentUrl: paymentUrl as string }
      }
      await paymentModel.update({ amount, definition })
    }

    const onUpdateUrl = new URL(this.config.paymentApiCallbackUrl)
    onUpdateUrl.pathname = '/application-payment/api-client-payment-callback'

    const { returnUrl, cancelUrl } = await this.getReturnUrls(applicationId)

    let paymentFlowUrls
    try {
      paymentFlowUrls =
        await this.paymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl({
          createDebtPaymentFlowInput: {
            payerNationalId: user.nationalId,
            onUpdateUrl: onUpdateUrl.toString(),
            metadata: {
              applicationId,
              paymentId: paymentModel.id,
            },
            returnUrl,
            cancelUrl,
            redirectToReturnUrlOnSuccess: true,
            debts,
          },
        })
    } catch (error) {
      this.logError('Failed to create debt payment flow', applicationId, error)
      throw error
    }
    this.logger.info(
      `Debt payment flow ${paymentFlowUrls.id} created for application ${applicationId}`,
    )
    const paymentUrl =
      locale === 'en' ? paymentFlowUrls.urls.en : paymentFlowUrls.urls.is

    await this.addPaymentUrlAndRequestId(
      applicationId,
      paymentModel.id,
      paymentUrl,
      paymentFlowUrls.id,
    )
    this.auditService.audit({
      auth: user,
      action: 'createCharge',
      resources: applicationId,
      meta: {
        applicationId,
        id: paymentModel.id,
        payIds: debts.map((debt) => debt.payId),
        amount,
      },
    })

    return {
      id: paymentModel.id,
      paymentUrl,
    }
  }

  // Never refunds: FJS has no reversal, so services-payments alone refunds debts
  async deleteDebtPayment(applicationId: string, user: User): Promise<void> {
    const payment = await this.findPaymentByApplicationId(applicationId)
    if (!payment) {
      return
    }

    if (payment.request_id) {
      if (await this.isDebtPaymentPaid(payment.request_id)) {
        throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
      }

      try {
        await this.paymentsApi.paymentFlowControllerDeletePaymentFlow({
          id: payment.request_id,
        })
      } catch (error) {
        // A rejected flow can still count as paid; it stays for its refund
        if (
          !(
            error instanceof FetchError &&
            error.problem?.detail === PaymentServiceCode.PaymentFlowAlreadyPaid
          )
        ) {
          this.logError(
            'Failed to delete debt payment flow',
            applicationId,
            error,
          )
          throw error
        }
      }
    }

    await this.delete(applicationId, user)
  }

  async rejectDebtPayment(
    paymentId: string,
    applicationId: string,
  ): Promise<void> {
    const payment = await this.paymentModel.findOne({
      where: { id: paymentId, application_id: applicationId },
    })
    if (
      !payment ||
      !isDebtPayment(payment) ||
      !payment.request_id ||
      !(await this.isDebtFlowClosed(payment.request_id))
    ) {
      return
    }

    if (payment.fulfilled) {
      this.logger.error(
        `Debt payment ${paymentId} for application ${applicationId} was rejected by FJS after it was paid`,
      )
    } else {
      this.logger.warn(
        `Debt payment ${paymentId} for application ${applicationId} was rejected by FJS`,
      )
    }

    await payment.update({
      fulfilled: false,
      definition: { ...parseDefinition(payment), rejected: true },
    })
  }

  async refundPayment(
    applicationId: string,
    reasonForRefund?: string,
    ignoreNotEligibleToBeRefunded?: boolean,
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
      const paymentStatus =
        await this.paymentsApi.paymentFlowControllerGetPaymentFlowStatus({
          id: payment.request_id,
        })
      if (
        paymentStatus.paymentStatus ===
        GetPaymentFlowStatusDTOPaymentStatusEnum.paid
      ) {
        try {
          this.logger.info(
            `payment already paid, calling refund controller to refund payment for application ${applicationId}`,
          )
          await this.paymentsApi.refundControllerRefund({
            refundPaymentInput: {
              paymentFlowId: payment.request_id,
              reasonForRefund,
            },
          })
        } catch (error) {
          if (
            error instanceof FetchError &&
            (ignoreNotEligibleToBeRefunded ?? false) &&
            error.problem?.detail ===
              PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded
          ) {
            this.logger.warn(
              `Ignoring not eligible to be refunded error for application ${applicationId}`,
              error,
            )
          } else {
            this.logError('Failed to refund payment', applicationId, error)
            throw error
          }
        }

        this.logger.info(
          `calling delete payment flow controller to delete payment flow for application ${applicationId}`,
        )
        try {
          await this.paymentsApi.paymentFlowControllerDeletePaymentFlow({
            id: payment.request_id,
          })
        } catch (error) {
          this.logError('Failed to delete payment flow', applicationId, error)
          throw error
        }
      }
    } catch (error) {
      this.logError('Failed to refund payment', applicationId, error)
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

  async getApplicationUrl(applicationId: string) {
    const application = await this.applicationService.findOneById(applicationId)
    if (!application) {
      throw new NotFoundException(
        `application was not found for application id ${applicationId}`,
      )
    }

    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${applicationId}`,
      )
    }

    const baseUrl = new URL(this.config.clientLocationOrigin)
    baseUrl.pathname = `umsoknir/${applicationSlug}/${applicationId}`
    const baseUrlString = baseUrl.toString()

    return baseUrlString
  }

  private async getReturnUrls(applicationId: string) {
    const baseUrlString = await this.getApplicationUrl(applicationId)

    return {
      returnUrl: `${baseUrlString}?done`,
      cancelUrl: `${baseUrlString}?cancelled`,
      invoiceUrl: `${baseUrlString}?invoice`,
    }
  }

  async setPaymentMethod(applicationId: string, paymentMethod: PaymentMethod) {
    const payment = await this.findPaymentByApplicationId(applicationId)
    if (!payment) {
      throw new NotFoundException(
        `payment was not found for application id ${applicationId}`,
      )
    }
    payment.payment_method = paymentMethod.toString()
    await payment.save()
  }
}
