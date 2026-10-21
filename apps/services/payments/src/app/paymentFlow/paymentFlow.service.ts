import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { InferAttributes, Sequelize, WhereOptions } from 'sequelize'
import { ConfigType } from '@nestjs/config'
import { isCompany, isPerson, isValid } from 'kennitala'
import { v4 as uuid } from 'uuid'

import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  Charge,
  ChargeResponse,
} from '@island.is/clients/charge-fjs-v2'
import { Op } from 'sequelize'
import { retry } from '@island.is/shared/utils/server'
import { paginate } from '@island.is/nest/pagination'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  FjsErrorCode,
  InvoiceErrorCode,
  PaymentServiceCode,
  DebtPaymentErrorCode,
} from '@island.is/shared/constants'

import {
  PaymentFlow,
  PaymentFlowAttributes,
  PaymentFlowCharge,
  PaymentFlowDebt,
  DebtSettlement,
  PaymentFlowEvent,
  FjsCharge,
  CardPaymentDetails,
  PaymentFulfillment,
  PaymentWorkerEvent,
} from './models'

import {
  PaymentFlowUpdateEvent,
  PaymentMethod,
  PaymentStatus,
  PaymentFlowEventType,
  PaymentFlowEventReason,
} from '../../types'
import {
  GetPaymentFlowDTO,
  CreatePaymentFlowInput,
  CreateDebtPaymentFlowInput,
  GetPaymentFlowsPaginatedDTO,
  CreatePaymentFlowDTO,
} from './dtos'

import { environment } from '../../environments'
import { CatalogItemWithQuantity } from '../../types/charges'
import {
  generateChargeFJSPayload,
  isNetworkError,
  FJS_NETWORK_ERROR,
  mapFjsErrorToCode,
} from '../../utils/fjsCharge'
import { processCharges } from '../../utils/chargeUtils'
import {
  CardPaymentSuccessResponse,
  PaymentTrackingData,
} from '../../types/cardPayment'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { generateWebhookJwt } from '../../utils/webhookAuth.utils'
import { JwksConfigService } from '../jwks/jwks-config.service'
import { ChargeItem } from '../../utils/chargeUtils'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { BankTransferPayment } from '../bankTransferPayment/models'
import { determinePaymentMethods } from './paymentFlow.utils'
import { DebtSettlementService } from '../debtPayment/debtSettlement.service'
import {
  DEBT_PAYMENT_PRODUCT_TITLE,
  FJS_DEBT_ORGANISATION_ID,
  isDebtFlowClosed,
} from '../../utils/fjsDebtPayment'

interface PaymentFlowUpdateConfig {
  /**
   * Whether to use retry logic when notifying the onUpdateUrl
   * @default true
   */
  useRetry?: boolean
  /**
   * Whether to throw an error if the update notification fails
   * @default true
   */
  throwOnError?: boolean
}

/**
 * Fields merged onto a log record. `message` and `level` are excluded: winston concatenates a
 * `message` key onto the real text and drops a `level` key, corrupting the line either way.
 */
type LogContextFields = Record<
  string,
  string | number | boolean | undefined
> & {
  message?: never
  level?: never
}

export type PaymentFlowAmountDetails =
  | ({ type: 'charge' } & Awaited<
      ReturnType<PaymentFlowService['getPaymentFlowChargeDetails']>
    >)
  | {
      type: 'debt'
      firstProductTitle: string
      totalPrice: number
      debts: PaymentFlowDebt[]
    }

/**
 * A webhook that does not answer is given up on, the application gets the event's record. Keeps
 * one notification, with its retries, inside the 60 s step timeout of the payment sagas.
 */
const WEBHOOK_TIMEOUT_MS = 10_000

@Injectable()
export class PaymentFlowService {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @InjectModel(PaymentFlowCharge)
    private readonly paymentFlowChargeModel: typeof PaymentFlowCharge,
    @InjectModel(PaymentFlowDebt)
    private readonly paymentFlowDebtModel: typeof PaymentFlowDebt,
    @InjectModel(PaymentFlowEvent)
    private readonly paymentFlowEventModel: typeof PaymentFlowEvent,
    @InjectModel(FjsCharge)
    private readonly fjsChargeModel: typeof FjsCharge,
    @InjectModel(CardPaymentDetails)
    private readonly cardPaymentDetailsModel: typeof CardPaymentDetails,
    @InjectModel(PaymentFulfillment)
    private readonly paymentFulfillmentModel: typeof PaymentFulfillment,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly debtSettlementService: DebtSettlementService,
    private jwksConfigService: JwksConfigService,
    @Inject(PaymentFlowModuleConfig.KEY)
    private readonly paymentFlowConfig: ConfigType<
      typeof PaymentFlowModuleConfig
    >,
    @Inject(JwksConfig.KEY)
    private readonly jwksConfig: ConfigType<typeof JwksConfig>,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Company bank transfers are rolled out per company. Evaluated with the company as the flag user
   * (there is no signed-in user here); the service maps it to `subjectType: 'legalEntity'`.
   */
  async isBankTransferAllowedForCompany(
    companyNationalId: string,
  ): Promise<boolean> {
    return this.featureFlagService.getValue(
      Features.isIslandisBankTransferPaymentAllowedForCompany,
      false,
      // Only `nationalId` is read by the service's user mapping.
      { nationalId: companyNationalId } as User,
    )
  }

  /**
   * Who may pay by bank transfer: a person, or a company the company flag allows. A temporary
   * kennitala is neither, so it is never allowed.
   */
  async isBankTransferAllowedForPayer(
    payerNationalId: string,
  ): Promise<boolean> {
    if (isPerson(payerNationalId)) {
      return true
    }

    if (!isCompany(payerNationalId)) {
      return false
    }

    return this.isBankTransferAllowedForCompany(payerNationalId)
  }

  /**
   * Whether bank transfer may be offered to this payer: the global flag is the offer kill-switch,
   * and then `isBankTransferAllowedForPayer` decides per payer.
   */
  private async isBankTransferOffered(
    payerNationalId: string,
  ): Promise<boolean> {
    const isBankTransferEnabled = await this.featureFlagService.getValue(
      Features.isIslandisBankTransferPaymentEnabled,
      false,
    )

    // With the flag off the payer does not matter, so the company flag is not evaluated.
    return (
      isBankTransferEnabled &&
      (await this.isBankTransferAllowedForPayer(payerNationalId))
    )
  }

  async createPaymentUrl(
    paymentInfo: CreatePaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    try {
      const paymentFlowId = uuid()
      const processedCharges = processCharges(paymentInfo.charges)

      const chargeDetails = await this.getPaymentFlowChargeDetails(
        paymentInfo.organisationId,
        processedCharges,
      )

      const paymentMethods = determinePaymentMethods(chargeDetails.catalogItems)

      // Bank transfer is gated behind the global feature flag and offered to the
      // payers `isBankTransferAllowedForPayer` allows — a company pays with an
      // individual who has the rights to authorise it, entered on the payment
      // screen. The global flag is the offer kill-switch: off → never listed, so the
      // FE selector never shows a method whose endpoints the flag also guards.
      let availableMethods = paymentMethods
      if (
        paymentMethods.includes(PaymentMethod.BANK_TRANSFER) &&
        !(await this.isBankTransferOffered(paymentInfo.payerNationalId))
      ) {
        availableMethods = paymentMethods.filter(
          (m) => m !== PaymentMethod.BANK_TRANSFER,
        )
      }

      if (availableMethods.length === 0) {
        throw new BadRequestException(PaymentServiceCode.InvalidPaymentMethods)
      }

      await this.validateCharge(
        {
          id: paymentFlowId,
          organisationId: paymentInfo.organisationId,
          payerNationalId: paymentInfo.payerNationalId,
          extraData: paymentInfo.extraData,
          chargeItemSubjectId: paymentInfo.chargeItemSubjectId,
        },
        chargeDetails.catalogItems,
      )

      return await this.sequelize.transaction(async (transaction) => {
        const paymentFlow = await this.paymentFlowModel.create(
          {
            ...paymentInfo,
            availablePaymentMethods: availableMethods,
            id: paymentFlowId,
            charges: [],
          },
          { transaction },
        )

        await this.paymentFlowChargeModel.bulkCreate(
          processedCharges.map((charge: ChargeItem) => ({
            ...charge,
            paymentFlowId,
          })),
          { transaction },
        )

        this.logger.info(
          `[${paymentFlow.id}] Payment flow created [${paymentFlow.organisationId}]`,
          {
            charges: processedCharges.map((c) => c.chargeItemCode),
          },
        )

        return {
          id: paymentFlow.id,
          urls: {
            is: `${this.paymentFlowConfig.webOrigin}/is/${paymentFlow.id}`,
            en: `${this.paymentFlowConfig.webOrigin}/en/${paymentFlow.id}`,
          },
        }
      })
    } catch (e) {
      this.logger.error('Failed to create payment url', e)

      if (e instanceof BadRequestException) {
        throw e
      }

      // TODO: Map error codes to PaymentServiceCode
      throw new BadRequestException(
        onlyReturnKnownErrorCode(
          e instanceof Error ? e.message : String(e),
          PaymentServiceCode.CouldNotCreatePaymentFlow,
        ),
      )
    }
  }

  /**
   * Creates a payment flow for debts owed to the state. FJS decides whether the debts can be paid,
   * and by what means, so the flow is only created once `validatePayment` has accepted them.
   */
  async createDebtPaymentUrl(
    input: CreateDebtPaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    const { debts } = input
    // FJS knows the payment by the flow id, so it is generated up front.
    const paymentFlowId = uuid()

    try {
      const validation = await this.debtSettlementService.validate({
        flowId: paymentFlowId,
        payerNationalId: input.payerNationalId,
        debts,
        paymentDate: new Date(),
      })

      // A duplicate can not happen for a new flow id, it is refused like any other 400
      if (
        validation.type === 'invalid' ||
        validation.type === 'already_registered'
      ) {
        this.logger.warn(`[${paymentFlowId}] FJS rejected the debts`, {
          problem: validation.problem,
        })
        throw new BadRequestException(DebtPaymentErrorCode.DebtPaymentInvalid)
      }

      if (validation.type === 'transient') {
        this.logger.error(`[${paymentFlowId}] Could not validate debts`, {
          error: validation.error,
        })
        throw new ServiceUnavailableException(
          DebtPaymentErrorCode.DebtPaymentUnavailable,
        )
      }

      const availableMethods: PaymentMethod[] = []
      if (validation.paymentOptions.has(PaymentMethod.CARD)) {
        availableMethods.push(PaymentMethod.CARD)
      }
      if (
        validation.paymentOptions.has(PaymentMethod.BANK_TRANSFER) &&
        (await this.isBankTransferOffered(input.payerNationalId))
      ) {
        availableMethods.push(PaymentMethod.BANK_TRANSFER)
      }

      if (availableMethods.length === 0) {
        this.logger.warn(
          `[${paymentFlowId}] No payment method available for the debts`,
          { paymentOptions: validation.rawPaymentOptions },
        )
        throw new BadRequestException(
          DebtPaymentErrorCode.DebtPaymentMethodNotAllowed,
        )
      }

      return await this.sequelize.transaction(async (transaction) => {
        const paymentFlow = await this.paymentFlowModel.create(
          {
            // Fields are picked rather than spread, so nothing outside the debt contract
            // (e.g. extraData or existingInvoiceId) can reach a debt flow.
            payerNationalId: input.payerNationalId,
            onUpdateUrl: input.onUpdateUrl,
            metadata: input.metadata,
            returnUrl: input.returnUrl,
            cancelUrl: input.cancelUrl,
            redirectToReturnUrlOnSuccess: input.redirectToReturnUrlOnSuccess,
            type: 'debt',
            // No productTitle: the pay page shows its own translated title for debt flows
            organisationId: FJS_DEBT_ORGANISATION_ID,
            availablePaymentMethods: availableMethods,
            id: paymentFlowId,
            charges: [],
          },
          { transaction },
        )

        await this.paymentFlowDebtModel.bulkCreate(
          debts.map((debt) => ({
            payId: debt.payId,
            amount: debt.amount,
            label: debt.label,
            paymentFlowId,
          })),
          { transaction },
        )

        this.logger.info(
          `[${paymentFlow.id}] Debt payment flow created [${paymentFlow.organisationId}]`,
          { debtCount: debts.length },
        )

        return {
          id: paymentFlow.id,
          urls: {
            is: `${this.paymentFlowConfig.webOrigin}/is/${paymentFlow.id}`,
            en: `${this.paymentFlowConfig.webOrigin}/en/${paymentFlow.id}`,
          },
        }
      })
    } catch (e) {
      // Logged where they were raised: a warning for debts FJS turned down, an error when FJS
      // could not be reached
      if (
        e instanceof BadRequestException ||
        e instanceof ServiceUnavailableException
      ) {
        throw e
      }

      this.logger.error('Failed to create debt payment url', e)

      throw new BadRequestException(
        PaymentServiceCode.CouldNotCreatePaymentFlow,
      )
    }
  }

  /**
   * Checks that a debt flow can still be paid with `paymentMethod`. Run right before a payment is
   * taken, since the debts can change after the flow was created: FJS has the final say.
   */
  async validateDebtPaymentFlow(
    paymentFlow: Pick<
      PaymentFlowAttributes,
      'id' | 'payerNationalId' | 'debts' | 'debtSettlement'
    >,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    // A rejected flow is terminal, the payer starts again from the application.
    if (paymentFlow.debtSettlement?.status === 'rejected') {
      throw new BadRequestException(DebtPaymentErrorCode.DebtPaymentFlowClosed)
    }

    const validation = await this.debtSettlementService.validate({
      flowId: paymentFlow.id,
      payerNationalId: paymentFlow.payerNationalId,
      debts: paymentFlow.debts ?? [],
      paymentDate: new Date(),
    })

    if (validation.type === 'invalid') {
      this.logger.warn(`[${paymentFlow.id}] FJS rejected the debts`, {
        problem: validation.problem,
      })
      throw new BadRequestException(DebtPaymentErrorCode.DebtPaymentInvalid)
    }

    // FJS already has a payment for this flow, taking the money again would pay twice
    if (validation.type === 'already_registered') {
      this.logger.warn(`[${paymentFlow.id}] FJS already has the debt payment`, {
        problem: validation.problem,
      })
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    if (validation.type === 'transient') {
      this.logger.error(`[${paymentFlow.id}] Could not validate debts`, {
        error: validation.error,
      })
      throw new ServiceUnavailableException(
        DebtPaymentErrorCode.DebtPaymentUnavailable,
      )
    }

    if (!validation.paymentOptions.has(paymentMethod)) {
      throw new BadRequestException(
        DebtPaymentErrorCode.DebtPaymentMethodNotAllowed,
      )
    }
  }

  /**
   * The payment page only offers the methods of a charge flow, but its endpoints are public, so the
   * service has the final say. Allowed are the methods stored on the flow when it was created, plus
   * the ones the payment page adds through the per-payer flags (same flags, same payers).
   */
  async validateChargePaymentMethod(
    paymentFlow: Pick<
      PaymentFlowAttributes,
      'id' | 'payerNationalId' | 'availablePaymentMethods'
    >,
    paymentMethod: PaymentMethod,
  ): Promise<void> {
    if (paymentFlow.availablePaymentMethods.includes(paymentMethod)) {
      return
    }

    // Only `nationalId` is read by the service's user mapping.
    const payer = { nationalId: paymentFlow.payerNationalId } as User

    if (
      paymentMethod === PaymentMethod.INVOICE &&
      (await this.featureFlagService.getValue(
        Features.isIslandisInvoicePaymentAllowedForUser,
        false,
        payer,
      ))
    ) {
      return
    }

    // The payment page never adds bank transfer for a company, the company flag decides that.
    if (
      paymentMethod === PaymentMethod.BANK_TRANSFER &&
      !isCompany(paymentFlow.payerNationalId) &&
      (await this.featureFlagService.getValue(
        Features.isIslandisBankTransferPaymentAllowedForUser,
        false,
        payer,
      ))
    ) {
      return
    }

    this.logger.warn(
      `[${paymentFlow.id}] Payment method not available for the payment flow`,
      { paymentMethod },
    )

    throw new BadRequestException(PaymentServiceCode.InvalidPaymentMethods)
  }

  /**
   * What the payer is paying for, whatever kind of flow it is: catalog charges priced by FJS, or
   * debts with amounts chosen by the payer.
   */
  async getPaymentFlowAmountDetails(
    paymentFlow: Pick<
      PaymentFlowAttributes,
      'organisationId' | 'charges' | 'debts' | 'productTitle'
    > & { type?: PaymentFlowAttributes['type'] },
  ): Promise<PaymentFlowAmountDetails> {
    if (paymentFlow.type === 'debt') {
      const debts = paymentFlow.debts ?? []

      return {
        type: 'debt',
        firstProductTitle:
          paymentFlow.productTitle ?? DEBT_PAYMENT_PRODUCT_TITLE,
        totalPrice: debts.reduce((sum, debt) => sum + debt.amount, 0),
        debts,
      }
    }

    const chargeDetails = await this.getPaymentFlowChargeDetails(
      paymentFlow.organisationId,
      paymentFlow.charges,
    )

    return { type: 'charge', ...chargeDetails }
  }

  async getPaymentFlowChargeDetails(
    organisationId: string,
    charges: ChargeItem[],
  ) {
    const { item } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg({
        performingOrgID: organisationId,
        chargeType: charges[0].chargeType,
        chargeItemCode: charges.map((c) => c.chargeItemCode),
        paymentOptions: true,
      })

    const filteredChargeInformation: CatalogItemWithQuantity[] = []

    for (const charge of charges) {
      const catalogProduct = item.find(
        (p) => p.chargeItemCode === charge.chargeItemCode,
      )

      if (!catalogProduct) {
        continue
      }

      const price = charge.price ?? catalogProduct.priceAmount

      filteredChargeInformation.push({
        ...catalogProduct,
        priceAmount: price,
        quantity: charge.quantity,
        chargeItemCode: catalogProduct.chargeItemCode,
        reference: charge.reference,
      })
    }

    if (filteredChargeInformation.length !== charges.length) {
      this.logger.error(
        `[${organisationId}] Failed to create payment flow: charge item codes not found in FJS catalog or other mismatch.`,
        {
          inputCharges: charges.map((c) => c.chargeItemCode),
          filteredCharges: filteredChargeInformation.map(
            (c) => c.chargeItemCode,
          ),
          missingCharges: charges.filter(
            (c) =>
              !filteredChargeInformation.some(
                (i) => i.chargeItemCode === c.chargeItemCode,
              ),
          ),
        },
      )
      throw new BadRequestException(PaymentServiceCode.ChargeItemCodesNotFound)
    }

    return {
      firstProductTitle: filteredChargeInformation?.[0]?.chargeItemName ?? null,
      totalPrice: filteredChargeInformation.reduce(
        (acc, charge) => acc + charge.priceAmount * charge.quantity,
        0,
      ),
      catalogItems: filteredChargeInformation,
    }
  }

  /**
   * Validates a charge payload against FJS.
   * @param chargePayload - The charge payload to validate
   */
  async validateCharge(
    paymentFlow: Pick<
      PaymentFlowAttributes,
      | 'id'
      | 'organisationId'
      | 'payerNationalId'
      | 'extraData'
      | 'chargeItemSubjectId'
      | 'returnUrl'
    >,
    charges: CatalogItemWithQuantity[],
  ): Promise<void> {
    try {
      await this.chargeFjsV2ClientService.validateCharge(
        generateChargeFJSPayload({
          paymentFlow,
          charges,
          systemId: environment.chargeFjs.systemId,
          returnUrl: paymentFlow.returnUrl,
        }),
      )
    } catch (e) {
      const fjsCode = mapFjsErrorToCode(e, true)

      this.logger.error(`[${paymentFlow.id}] Failed to validate charge`, {
        error: e,
        fjsCode,
      })

      throw new BadRequestException(
        fjsCode ?? PaymentServiceCode.UnknownPaymentServiceError,
      )
    }
  }

  private async getPayerName(payerNationalId: string): Promise<string> {
    if (!isValid(payerNationalId)) {
      throw new BadRequestException(PaymentServiceCode.InvalidPayerNationalId)
    }

    let payerName: string | null = null

    try {
      const payeeInfo = await this.chargeFjsV2ClientService.getPayeeInfo(
        payerNationalId,
      )

      payerName = payeeInfo.name
    } catch (e) {
      this.logger.error(`Failed to get payer name from FJS`, { error: e })
    }

    if (payerName === null || payerName.length === 0) {
      if (isCompany(payerNationalId)) {
        throw new BadRequestException(PaymentServiceCode.CompanyNotFound)
      }

      throw new BadRequestException(PaymentServiceCode.PersonNotFound)
    }

    return payerName
  }

  /**
   * Checks if a payment flow is eligible to be paid.
   * Returns true if the payment flow is eligible to be paid, false if it has already been paid.
   */
  async isEligibleToBePaid(id: string) {
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    const paymentFulfillment = (
      await this.paymentFulfillmentModel.findOne({
        where: {
          paymentFlowId: id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    if (paymentFulfillment) {
      return false
    }

    // TODO: look for fjs charge (invoice pending?)

    return true
  }

  async getPaymentFlowDetails(id: string, includeEvents?: boolean) {
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id,
          isDeleted: false,
        },
        include: [
          {
            model: PaymentFlowCharge,
          },
          {
            model: PaymentFlowDebt,
          },
          {
            model: DebtSettlement,
            required: false,
          },
          {
            model: FjsCharge,
            where: { isDeleted: false },
            required: false,
          },
          ...(includeEvents
            ? [
                {
                  model: PaymentFlowEvent,
                  as: 'events',
                },
              ]
            : []),
        ],
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    return paymentFlow
  }

  async getPaymentFlowStatus(paymentFlow: PaymentFlowAttributes) {
    const paymentFulfillment = (
      await this.paymentFulfillmentModel.findOne({
        where: {
          paymentFlowId: paymentFlow.id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    // If a payment fulfillment exists, the payment flow is paid by card or bank transfer
    if (paymentFulfillment) {
      return {
        paymentStatus: PaymentStatus.PAID,
        updatedAt: paymentFulfillment.created,
      }
    }

    // for invoice payments, we need to check the status of the fjs charge
    const existingFjsCharge = (
      await this.fjsChargeModel.findOne({
        where: {
          paymentFlowId: paymentFlow.id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    // If the fjs charge exists and is unpaid, the invoice is pending
    if (existingFjsCharge && existingFjsCharge.status === 'unpaid') {
      return {
        paymentStatus: PaymentStatus.INVOICE_PENDING,
        updatedAt: existingFjsCharge.created,
      }
    }

    return {
      paymentStatus: PaymentStatus.UNPAID,
      updatedAt: existingFjsCharge?.created ?? paymentFlow.modified,
    }
  }

  async getPaymentFlow(
    id: string,
    includeEvents?: boolean,
  ): Promise<GetPaymentFlowDTO | null> {
    try {
      const paymentFlow = await this.getPaymentFlowDetails(id, includeEvents)
      const paymentDetails = await this.getPaymentFlowAmountDetails(paymentFlow)
      const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
        paymentFlow,
      )

      const payerName = await this.getPayerName(paymentFlow.payerNationalId)

      return {
        ...paymentFlow,
        productTitle:
          paymentFlow.productTitle ?? paymentDetails.firstProductTitle,
        productPrice: paymentDetails.totalPrice,
        payerName,
        availablePaymentMethods:
          paymentFlow.availablePaymentMethods as PaymentMethod[],
        paymentStatus,
        updatedAt,
        isClosed: isDebtFlowClosed(paymentFlow),
        type: paymentFlow.type ?? 'charge',
        events: includeEvents
          ? paymentFlow.events?.map((event) => ({
              ...event,
              type: event.type as PaymentFlowEventType,
              reason: event.reason as PaymentFlowEventReason,
            }))
          : undefined,
      }
    } catch (e) {
      this.logger.error(`[${id}] Failed to get payment flow`, e)
      throw e
    }
  }

  /**
   * `update/payment_finalized`: FJS accepted (202) the debt payment, it owns it from here.
   * `dateCreated` is missing when the 202 was lost and FJS only reported the payment as a duplicate.
   */
  async logDebtPaymentFinalized(
    paymentFlowId: string,
    paymentMethod: PaymentMethod,
    registration: { dateCreated?: string },
  ) {
    await this.logPaymentFlowUpdate(
      {
        paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod,
        reason: 'payment_finalized',
        message: 'Debt payment registered with FJS',
        metadata: {
          dateCreated: registration.dateCreated,
        },
      },
      { useRetry: true, throwOnError: false },
    )
  }

  /**
   * `error/payment_failed`: FJS rejected a debt payment that was captured. The event is the
   * durable record too, `needsManualRefund` marks the payments nothing refunds automatically.
   */
  async logDebtPaymentRejected(
    paymentFlowId: string,
    paymentMethod: PaymentMethod,
    problem: object | undefined,
    { needsManualRefund = false }: { needsManualRefund?: boolean } = {},
  ) {
    await this.logPaymentFlowUpdate(
      {
        paymentFlowId,
        type: 'error',
        occurredAt: new Date(),
        paymentMethod,
        reason: 'payment_failed',
        message: 'FJS rejected the debt payment',
        metadata: {
          fjsProblem: problem,
          ...(needsManualRefund ? { needsManualRefund: true } : {}),
        },
      },
      { useRetry: true, throwOnError: false },
    )
  }

  /**
   * Whether the card payment behind an active fulfillment was refunded already, so the worker
   * neither charges for it nor refunds it again. Matched on the payment's correlation id, since
   * a refunded charge flow can be paid again.
   *
   * The payment saga's rollback refunds, then logs `payment_failed` with the refund. The refund
   * saga deletes the fulfillment before refunding, but when a step after the refund fails its
   * rollback restores the fulfillment: `refund_completed` is logged with the correlation id,
   * by the saga or by the orchestration's clean-up failure.
   */
  async isCardPaymentRefunded(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<boolean> {
    const events = await this.paymentFlowEventModel.findAll({
      where: {
        paymentFlowId,
        reason: { [Op.in]: ['payment_failed', 'refund_completed'] },
      },
    })

    return events.some((event) => {
      const metadata = event.metadata as
        | {
            refund?: unknown
            correlationId?: string
            payment?: { correlationID?: string }
          }
        | undefined

      // Events from before `correlationId` was added only have the one the gateway echoed
      const eventCorrelationId =
        metadata?.correlationId ?? metadata?.payment?.correlationID

      const isRefund =
        event.reason === 'refund_completed' ? true : !!metadata?.refund

      return isRefund && eventCorrelationId === correlationId
    })
  }

  /**
   * Whether `payment_completed` was recorded for this capture, delivered or not: once it is, the
   * notification that recorded it is delivering it, with its retries.
   */
  async hasPaymentCompletedEvent(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<boolean> {
    const events = await this.paymentFlowEventModel.findAll({
      where: { paymentFlowId, reason: 'payment_completed' },
    })

    return events.some(
      (event) =>
        (event.metadata as { payment?: { correlationID?: string } } | undefined)
          ?.payment?.correlationID === correlationId,
    )
  }

  async logPaymentFlowUpdate(
    update: {
      paymentFlowId: string
      type: PaymentFlowEvent['type']
      occurredAt: Date
      paymentMethod: PaymentMethod
      reason: PaymentFlowEvent['reason']
      message: string
      metadata?: object
      /**
       * Identifiers for this call's log line only — unlike `metadata`, which is persisted and sent
       * upstream. Lets the caller skip logging a second line of its own. Message text unchanged.
       */
      logContext?: LogContextFields
      /** Defaults to `info`. `warn` for outcomes that need attention, e.g. a provider-side fault. */
      logLevel?: 'info' | 'warn'
    },
    config: PaymentFlowUpdateConfig = { useRetry: false, throwOnError: false },
  ) {
    this.logger[update.logLevel ?? 'info'](
      `[${update.paymentFlowId}] ${update.type}: ${update.message}`,
      // Spread, not passed through: an empty object contributes no fields, so callers that pass
      // no context are unaffected.
      { ...update.logContext },
    )
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id: update.paymentFlowId,
          isDeleted: false,
        },
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    const updateBody: PaymentFlowUpdateEvent = {
      type: update.type,
      paymentFlowId: update.paymentFlowId,
      paymentFlowMetadata: paymentFlow.metadata,
      occurredAt: update.occurredAt,
      details: {
        paymentMethod: update.paymentMethod,
        reason: update.reason,
        message: update.message,
        // Always an object, the application's callback validates it as one
        eventMetadata: update.metadata ?? {},
      },
    }

    const notifyUpdateUrl = async (attempt?: number) => {
      try {
        // Generate the JWT
        const token = generateWebhookJwt(
          { id: paymentFlow.id, onUpdateUrl: paymentFlow.onUpdateUrl },
          { type: update.type },
          updateBody,
          {
            ...this.jwksConfig,
            privateKey: this.jwksConfigService.getPrivateKey(),
          },
          this.logger,
        )

        const response = await fetch(paymentFlow.onUpdateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateBody),
          signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
        })

        if (!response.ok) {
          const errorBody = await response
            .text()
            .catch(() => 'Could not read error body')
          const errorMessage = `Failed to notify onUpdateUrl: ${response.status} ${response.statusText}, body: ${errorBody}`

          this.logger.warn(
            `[${update.paymentFlowId}] Failed to notify onUpdateUrl [${
              update.type
            }]${attempt ? ` (attempt ${attempt})` : ''}: ${response.status} ${
              response.statusText
            }`,
            {
              url: paymentFlow.onUpdateUrl,
              responseBody: errorBody,
            },
          )

          // Update delivery status to failed
          await this.updateEventDeliveryStatus(
            eventRecord.id,
            false,
            errorMessage,
          )

          if (config.throwOnError) {
            throw new Error(errorMessage)
          }
        } else {
          // Update delivery status to successful
          await this.updateEventDeliveryStatus(eventRecord.id, true)

          this.logger.info(
            `[${update.paymentFlowId}] Successfully notified onUpdateUrl [${update.type}]`,
            {
              url: paymentFlow.onUpdateUrl,
              reason: update.reason,
            },
          )
        }
      } catch (error) {
        // Update delivery status to failed
        await this.updateEventDeliveryStatus(
          eventRecord.id,
          false,
          error.message,
        )

        if (config.throwOnError) {
          throw error
        }
      }
    }

    // Save event to database first, then attempt delivery
    let eventRecord: PaymentFlowEvent
    try {
      eventRecord = await this.paymentFlowEventModel.create({
        ...update,
        deliveredToUpstream: null, // Will be updated after delivery attempt
        deliveredAt: null,
        deliveryError: null,
      })
    } catch (e) {
      this.logger.error(
        `[${update.paymentFlowId}] Failed to create payment flow event record`,
        { error: e },
      )
      throw e // Don't proceed if we can't create the record
    }

    // Now attempt delivery with the event record already saved
    if (config.useRetry) {
      await retry(notifyUpdateUrl, {
        maxRetries: 3,
        retryDelayMs: 1000,
        logger: this.logger,
        logPrefix: `[${update.paymentFlowId}] Notify onUpdateUrl for flow event type ${update.type}`,
      })
    } else {
      await notifyUpdateUrl()
    }
  }

  /**
   * Updates the delivery status of a payment flow event.
   * This allows tracking which events were successfully delivered to upstream systems.
   */
  private async updateEventDeliveryStatus(
    eventId: string,
    delivered: boolean,
    error?: string,
  ): Promise<void> {
    try {
      await this.paymentFlowEventModel.update(
        {
          deliveredToUpstream: delivered,
          deliveredAt: delivered ? new Date() : null,
          deliveryError: delivered ? null : error,
        },
        {
          where: { id: eventId },
        },
      )
    } catch (updateError) {
      this.logger.error(
        `Failed to update delivery status for event ${eventId}`,
        { error: updateError },
      )
      // Don't throw - this is not critical enough to fail the main operation
    }
  }

  /**
   * Gets all events that failed to deliver to upstream systems.
   * Useful for retry mechanisms and monitoring.
   */
  async getFailedDeliveryEvents(): Promise<PaymentFlowEvent[]> {
    return await this.paymentFlowEventModel.findAll({
      where: {
        deliveredToUpstream: false,
      },
      order: [['created', 'ASC']],
    })
  }

  async createCardPaymentConfirmation({
    paymentResult,
    paymentFlowId,
    totalPrice,
    paymentTrackingData,
  }: {
    paymentResult: CardPaymentSuccessResponse
    paymentFlowId: string
    totalPrice: number
    paymentTrackingData: PaymentTrackingData
  }) {
    try {
      return await retry(
        async () => {
          return await this.sequelize.transaction(async (transaction) => {
            const confirmation = await this.cardPaymentDetailsModel.create(
              {
                id: paymentTrackingData.correlationId,
                acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
                authorizationCode: paymentResult.authorizationCode,
                cardScheme: paymentResult.cardInformation.cardScheme,
                maskedCardNumber: paymentResult.maskedCardNumber,
                paymentFlowId,
                cardUsage: paymentResult.cardInformation.cardUsage,
                totalPrice,
                merchantReferenceData:
                  paymentTrackingData.merchantReferenceData,
              },
              { transaction },
            )

            await this.paymentFulfillmentModel.create(
              {
                paymentFlowId,
                paymentMethod: 'card',
                confirmationRefId: confirmation.id,
              },
              { transaction },
            )

            return confirmation
          })
        },
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          shouldRetryOnError: (error) => {
            const code = mapFjsErrorToCode(error, true)

            if (code === FjsErrorCode.AlreadyCreatedCharge) {
              return false
            }

            return true
          },
          logger: this.logger,
          logPrefix: 'Failed to persist payment confirmation',
        },
      )
    } catch {
      this.logger.error(
        `[${paymentFlowId}] Failed to create payment confirmation`,
      )

      throw new BadRequestException(
        PaymentServiceCode.CouldNotCreatePaymentConfirmation,
      )
    }
  }

  async findPaymentFulfillmentForPaymentFlow(paymentFlowId: string) {
    const paymentFulfillment = await this.paymentFulfillmentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    return paymentFulfillment?.toJSON() ?? null
  }

  /**
   * Creates an invoice payment confirmation for a completed FJS charge.
   * This method is idempotent - calling it multiple times with the same parameters
   * will not create duplicate fulfillments.
   *
   * Soft-deleted flows are rejected by findFjsChargeByReceptionId (charge lookup
   * requires a non-deleted payment flow).
   *
   * @param paymentFlowId - The payment flow ID
   * @param receptionId - The FJS reception ID from the callback
   * @returns Promise<void>
   * @throws BadRequestException if FJS charge not found or processing fails
   */
  async createInvoicePaymentConfirmation(
    paymentFlowId: string,
    receptionId: string,
  ): Promise<void> {
    const fjsCharge = await this.findFjsChargeByReceptionId(
      paymentFlowId,
      receptionId,
    )

    await this.processInvoicePaymentWithRetry(paymentFlowId, fjsCharge)
  }

  /**
   * Finds an FJS charge by reception ID and validates it belongs to the payment flow.
   * Only returns a charge when both the charge and the referenced payment flow are not soft-deleted.
   * This provides an additional security check in case of token issues.
   */
  private async findFjsChargeByReceptionId(
    paymentFlowId: string,
    receptionId: string,
  ) {
    const fjsCharge = await this.fjsChargeModel.findOne({
      where: { paymentFlowId, receptionId, isDeleted: false },
      include: [
        {
          model: PaymentFlow,
          where: { isDeleted: false },
          required: true,
          attributes: [],
        },
      ],
    })

    if (!fjsCharge) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    return fjsCharge
  }

  /**
   * Processes the invoice payment with retry logic for transient failures.
   * Handles race conditions gracefully by treating duplicate fulfillments as success.
   */
  private async processInvoicePaymentWithRetry(
    paymentFlowId: string,
    fjsCharge: { id: string },
  ): Promise<void> {
    try {
      await retry(
        () => this.createInvoicePaymentFulfillment(paymentFlowId, fjsCharge),
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          logger: this.logger,
          logPrefix: 'Failed to create invoice payment confirmation',
          shouldRetryOnError: this.shouldRetryInvoicePayment,
        },
      )
    } catch (error) {
      this.handleInvoicePaymentError(paymentFlowId, error)
    }
  }

  /**
   * Creates the payment fulfillment and updates the FJS charge status atomically.
   * This method is idempotent - if a fulfillment already exists, it returns early.
   */
  private async createInvoicePaymentFulfillment(
    paymentFlowId: string,
    fjsCharge: { id: string },
  ): Promise<void> {
    return await this.sequelize.transaction(async (transaction) => {
      // Check if already processed (idempotency)
      const existingFulfillment = await this.paymentFulfillmentModel.findOne({
        where: { paymentFlowId, paymentMethod: 'invoice', isDeleted: false },
        transaction,
      })

      if (existingFulfillment) {
        this.logger.info(
          `[${paymentFlowId}] Invoice payment fulfillment already exists`,
        )
        return
      }

      // Create fulfillment and update charge status atomically
      await this.paymentFulfillmentModel.create(
        {
          paymentFlowId,
          paymentMethod: 'invoice',
          confirmationRefId: fjsCharge.id,
          fjsChargeId: fjsCharge.id,
        },
        { transaction },
      )

      await this.fjsChargeModel.update(
        { status: 'paid' },
        { where: { id: fjsCharge.id }, transaction },
      )

      this.logger.info(
        `[${paymentFlowId}] Successfully created invoice payment fulfillment`,
        { chargeId: fjsCharge.id },
      )
    })
  }

  /**
   * Determines whether an error should trigger a retry.
   * Race conditions (unique constraint errors) are treated as success.
   */
  private shouldRetryInvoicePayment = (error: Error): boolean => {
    // Don't retry on race conditions - they indicate success
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return false
    }

    // Retry on transient database errors
    return true
  }

  /**
   * Handles errors from invoice payment processing.
   * Race conditions are treated as success since the payment was already processed.
   */
  private handleInvoicePaymentError(paymentFlowId: string, error: Error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      this.logger.info(
        `[${paymentFlowId}] Invoice payment already processed (race condition)`,
      )
      return
    }

    this.logger.error(
      `[${paymentFlowId}] Failed to create invoice payment confirmation`,
      error,
    )

    throw new BadRequestException(
      InvoiceErrorCode.FailedToCreateInvoiceConfirmation,
    )
  }

  /**
   * Creates the charge at FJS, then records it locally. Separate `try` blocks so a local write
   * failure is not mapped through `mapFjsErrorToCode` and reported as an FJS failure.
   */
  async createFjsCharge(paymentFlowId: string, chargePayload: Charge) {
    let charge: ChargeResponse

    try {
      charge = await this.chargeFjsV2ClientService.createCharge(chargePayload)
    } catch (e) {
      if (isNetworkError(e)) {
        throw new BadRequestException(FJS_NETWORK_ERROR)
      }

      const code = mapFjsErrorToCode(e, true)
      if (code === FjsErrorCode.AlreadyCreatedCharge) {
        // The charge already exists in FJS (idempotency key requestID == paymentFlowId) but a prior
        // attempt failed to persist/link it locally. Reconcile instead of failing.
        const reconciled = await this.reconcileExistingFjsCharge(
          paymentFlowId,
          chargePayload,
        )
        if (reconciled) {
          return reconciled
        }
        // Not logged: this cannot tell a not-yet-committed concurrent finalizer from a genuine
        // orphan, and the throw below is already surfaced by the caller and the worker's retries.
      } else {
        this.logger.error(
          `[${paymentFlowId}] Failed to create payment charge`,
          e,
        )
      }
      throw new BadRequestException(mapFjsErrorToCode(e))
    }

    try {
      const newCharge = await this.fjsChargeModel.create({
        paymentFlowId,
        receptionId: charge.receptionID,
        user4: charge.user4,
        status: chargePayload.payInfo ? 'paid' : 'unpaid',
      })

      await this.updateFlowAndFulfillmentWithFjsCharge(
        paymentFlowId,
        charge.receptionID,
        newCharge.id,
        !!chargePayload.payInfo,
      )

      return newCharge
    } catch (e) {
      if ((e as Error)?.name === 'SequelizeUniqueConstraintError') {
        // Either unique index can fire here and the error does not say which, so compare
        // reception ids rather than assuming a duplicate.
        const reconciled = await this.reconcileExistingFjsCharge(
          paymentFlowId,
          chargePayload,
        )

        if (reconciled?.receptionId === charge.receptionID) {
          // FJS handed back the charge it already had; nothing was duplicated, nothing to report.
          return reconciled
        }

        if (reconciled) {
          // A charge exists at FJS that we never persisted, so this id is the only handle on it.
          this.logger.error(
            `[${paymentFlowId}] CRITICAL: FJS accepted a duplicate charge — this reception id was never persisted and must be reversed manually`,
            {
              // Monitors alert on this field, not the message text.
              needsManualReversal: true,
              receptionId: charge.receptionID,
              user4: charge.user4,
            },
          )

          // Durable record so the orphan stays findable if the alert is missed. Written directly,
          // not via `logPaymentFlowUpdate`: that would webhook an internal reconciliation issue to
          // the organisation. Best effort — the adopt above succeeded, and failing it here would
          // send the retry down the reconcile path, which never sees this reception id again.
          await this.paymentFlowEventModel
            .create({
              paymentFlowId,
              type: 'error',
              reason: 'other',
              paymentMethod: 'system',
              occurredAt: new Date(),
              message:
                'FJS accepted a duplicate charge that was never persisted — reverse manually',
              metadata: {
                needsManualReversal: true,
                receptionId: charge.receptionID,
                user4: charge.user4,
              },
            })
            .catch((error) => {
              this.logger.error(
                `[${paymentFlowId}] Failed to persist the orphaned FJS charge event`,
                {
                  needsManualReversal: true,
                  receptionId: charge.receptionID,
                  error: (error as Error)?.message,
                },
              )
            })

          return reconciled
        }

        // Conflict is with a soft-deleted row (a previous refund), so no duplicate to claim.
        this.logger.error(
          `[${paymentFlowId}] FJS charge conflicts with a soft-deleted local row and has no active row to adopt — needs reconciliation`,
          {
            needsReconciliation: true,
            receptionId: charge.receptionID,
            user4: charge.user4,
          },
        )
        throw new BadRequestException(FjsErrorCode.FailedToCreateCharge)
      }

      // The charge exists at FJS either way. If the row was inserted and only the linking failed,
      // the caller's `retry` (then the worker) reconciles it. If the insert itself failed there is
      // no row to reconcile, so these ids are the only handle on the charge.
      this.logger.error(
        `[${paymentFlowId}] FJS accepted the charge but the local record could not be completed`,
        {
          receptionId: charge.receptionID,
          user4: charge.user4,
          errorName: (e as Error)?.name,
          error: (e as Error)?.message,
        },
      )
      throw new BadRequestException(FjsErrorCode.FailedToCreateCharge)
    }
  }

  /**
   * Links a charge that already exists in FJS to our DB by adopting the already-persisted local `fjs_charge` row — which carries
   * the real FJS reception id — and linking the fulfillment + flow.
   */
  private async reconcileExistingFjsCharge(
    paymentFlowId: string,
    chargePayload: Charge,
  ): Promise<FjsCharge | null> {
    const charge = await this.fjsChargeModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    if (!charge) {
      return null
    }

    await this.updateFlowAndFulfillmentWithFjsCharge(
      paymentFlowId,
      charge.receptionId,
      charge.id,
      !!chargePayload.payInfo,
    )

    this.logger.info(`[${paymentFlowId}] Reconciled pre-existing FJS charge`, {
      fjsChargeId: charge.id,
    })

    return charge
  }

  private async updateFlowAndFulfillmentWithFjsCharge(
    paymentFlowId: string,
    receptionId: string,
    fjsChargeId: string,
    hasPayInfo: boolean,
  ): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.paymentFlowModel.update(
        { existingInvoiceId: receptionId },
        { where: { id: paymentFlowId }, transaction },
      )

      if (hasPayInfo) {
        await this.paymentFulfillmentModel.update(
          { fjsChargeId },
          { where: { paymentFlowId, isDeleted: false }, transaction },
        )
      }
    })
  }

  /**
   * Finds paid payment flows of the given method that don't have an FJS charge yet.
   * Used by the FJS worker to backfill missing charges.
   *
   * The details include is a left join on purpose: an orphaned flow (active fulfillment,
   * details row soft-deleted — e.g. an interrupted refund) must still be returned so the
   * worker can surface it as a failure instead of it staying invisible.
   *
   * @param cutoffTime - Only include flows whose fulfillment was created before this time (gives other systems time to finalize)
   * @param paymentMethod - Which payment method's fulfillments to sweep
   */
  async findPaidFlowsWithoutFjsCharge(
    cutoffTime: Date,
    paymentMethod: 'card' | 'bank_transfer',
  ): Promise<InferAttributes<PaymentFlow>[]> {
    const paymentFlows = await this.paymentFlowModel.findAll({
      // Debt flows have no FJS charge, see findDebtFlowsToSettle
      where: { isDeleted: false, type: 'charge' },
      include: [
        {
          model: PaymentFulfillment,
          required: true,
          where: {
            paymentMethod,
            fjsChargeId: null,
            created: { [Op.lt]: cutoffTime },
            isDeleted: false,
          },
        },
        { model: PaymentFlowCharge, separate: true },
        paymentMethod === 'card'
          ? {
              model: CardPaymentDetails,
              required: true,
              where: { isDeleted: false },
            }
          : {
              // Carries the providerPaymentId needed to rebuild the FJS charge.
              model: BankTransferPayment,
              required: false,
              where: { isDeleted: false },
              separate: true,
            },
        {
          model: PaymentWorkerEvent,
          required: false,
          where: { taskType: 'create_fjs_charge' },
          order: [['created', 'DESC']],
          separate: true,
        },
      ],
    })

    return paymentFlows
  }

  /**
   * Finds paid debt flows whose payment is not registered with FJS yet, for the payment worker:
   * no `debt_settlement` row or a pending one, and no attempt lately. Also card flows FJS
   * rejected whose refund is still due: a refund the worker started that failed is retried until
   * the fulfillment is gone. A refund that failed while a payment saga rolled back is not, the
   * rollback removed the fulfillment first, and the card is refunded by hand. Rejected bank
   * transfers wait for a manual refund and are left out.
   *
   * @param cutoffTime - Only include flows whose fulfillment and last attempt are older than this
   */
  async findDebtFlowsToSettle(
    cutoffTime: Date,
  ): Promise<InferAttributes<PaymentFlow>[]> {
    return this.paymentFlowModel.findAll({
      where: {
        isDeleted: false,
        type: 'debt',
        [Op.and]: [
          {
            [Op.or]: [
              { '$debtSettlement.id$': null },
              { '$debtSettlement.status$': 'pending' },
              {
                [Op.and]: [
                  { '$debtSettlement.status$': 'rejected' },
                  { '$paymentFulfillments.payment_method$': 'card' },
                ],
              },
            ],
          },
          {
            [Op.or]: [
              { '$debtSettlement.last_attempt_at$': null },
              { '$debtSettlement.last_attempt_at$': { [Op.lt]: cutoffTime } },
            ],
          },
        ],
      },
      include: [
        {
          model: PaymentFulfillment,
          required: true,
          where: {
            paymentMethod: { [Op.in]: ['card', 'bank_transfer'] },
            created: { [Op.lt]: cutoffTime },
            isDeleted: false,
          },
        },
        { model: DebtSettlement, required: false },
        { model: PaymentFlowDebt, separate: true },
        {
          model: CardPaymentDetails,
          required: false,
          where: { isDeleted: false },
          separate: true,
        },
        {
          model: BankTransferPayment,
          required: false,
          where: { isDeleted: false },
          separate: true,
        },
        {
          model: PaymentWorkerEvent,
          required: false,
          where: { taskType: 'pay_fjs_debt' },
          order: [['created', 'DESC']],
          separate: true,
        },
      ],
    })
  }

  async deleteFjsCharge(
    paymentFlowId: string,
    { throwOnError = true }: { throwOnError?: boolean } = {},
  ): Promise<void> {
    this.logger.info(`[${paymentFlowId}] Attempting to delete FJS charge`)

    // Deleting/cancelling the FJS charge IS the refund — it returns the money to the payer. If this
    // fails the money was NOT returned, so surface it (when throwOnError) to let the saga roll back.
    try {
      await this.requestFjsChargeDeletion(paymentFlowId)
    } catch (error) {
      this.logger.error(`[${paymentFlowId}] Failed to delete FJS charge`, {
        error: error.message,
        stack: error.stack,
      })
      if (throwOnError) {
        throw error
      }
      return
    }

    // FJS confirmed the deletion — the refund is committed and irreversible from our side. A failure
    // to mark the local row deleted must NOT throw: rethrowing here would roll the saga back and
    // resurrect the PAID state even though the money was already returned. Log for reconciliation.
    try {
      const [updatedCount] = await this.fjsChargeModel.update(
        { isDeleted: true },
        { where: { paymentFlowId, isDeleted: false } },
      )
      if (updatedCount > 0) {
        this.logger.info(`[${paymentFlowId}] Marked FjsCharge as deleted`)
      } else {
        this.logger.warn(`[${paymentFlowId}] No FjsCharge found to delete`)
      }
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] FJS charge deleted but failed to mark local FjsCharge row as deleted — needs reconciliation`,
        { error: error.message, stack: error.stack },
      )
    }
  }

  /**
   * Asks FJS to delete the charge. Resolves on a success response and on FJS's idempotent
   * "already cancelled" response.
   */
  private async requestFjsChargeDeletion(paymentFlowId: string): Promise<void> {
    try {
      await this.chargeFjsV2ClientService.deleteCharge(paymentFlowId)
      this.logger.info(
        `[${paymentFlowId}] Successfully requested deletion of FJS charge`,
      )
    } catch (error) {
      if (
        mapFjsErrorToCode(error, true) !== FjsErrorCode.AlreadyDeletedCharge
      ) {
        throw error
      }
      this.logger.info(`[${paymentFlowId}] FJS charge was already cancelled`)
    }
  }

  async deletePaymentFlow(id: string): Promise<GetPaymentFlowDTO> {
    const paymentFlowDetails = await this.getPaymentFlowDetails(id)

    const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
      paymentFlowDetails,
    )

    if (paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    // Construct the DTO to be returned before deleting
    const paymentDetails = await this.getPaymentFlowAmountDetails(
      paymentFlowDetails,
    )
    const payerName = await this.getPayerName(
      paymentFlowDetails.payerNationalId,
    )

    const paymentFlowDTO: GetPaymentFlowDTO = {
      ...paymentFlowDetails,
      productTitle:
        paymentFlowDetails.productTitle ?? paymentDetails.firstProductTitle,
      productPrice: paymentDetails.totalPrice,
      payerName,
      availablePaymentMethods:
        paymentFlowDetails.availablePaymentMethods as PaymentMethod[],
      paymentStatus,
      updatedAt,
      isClosed: isDebtFlowClosed(paymentFlowDetails),
      type: paymentFlowDetails.type ?? 'charge',
      events: paymentFlowDetails.events?.map((event) => ({
        ...event,
        type: event.type as PaymentFlowEventType,
        reason: event.reason as PaymentFlowEventReason,
      })),
    }

    if (paymentFlowDetails.onUpdateUrl) {
      await this.logPaymentFlowUpdate({
        paymentFlowId: id,
        type: 'delete',
        occurredAt: new Date(),
        paymentMethod: 'system' as PaymentMethod,
        reason: 'deleted_admin', // TODO: connect with systemId when we have machine clients?
        message: 'Payment flow deleted by admin action.', // TODO: same as above?
      })
    }

    if (paymentFlowDetails.fjsCharge) {
      await this.deleteFjsCharge(id, { throwOnError: false })
    }

    await this.paymentFlowModel.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } },
    )

    return paymentFlowDTO
  }

  async getCardPaymentConfirmationForPaymentFlow(paymentFlowId: string) {
    const cardPaymentConfirmation = await this.cardPaymentDetailsModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    return cardPaymentConfirmation?.toJSON() ?? null
  }

  async deleteCardPaymentConfirmation(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<InferAttributes<CardPaymentDetails> | null> {
    try {
      const [updatedCount, [updatedCardPaymentDetails]] =
        await this.cardPaymentDetailsModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              id: correlationId,
              paymentFlowId: paymentFlowId,
              isDeleted: false,
            },
            returning: true,
          },
        )

      if (updatedCount > 0) {
        this.logger.info(
          `[${paymentFlowId}] Payment confirmation marked as deleted (correlationId: ${correlationId})`,
        )
      } else {
        this.logger.warn(
          `[${paymentFlowId}] Payment confirmation not found for deletion (correlationId: ${correlationId})`,
        )
      }

      return updatedCardPaymentDetails?.toJSON() ?? null
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] Failed to delete payment confirmation (correlationId: ${correlationId})`,
        { error },
      )
      // Not re-throwing, to prevent disruption of a primary flow (e.g., refund)
      return null
    }
  }

  async deletePaymentFulfillment({
    paymentFlowId,
    confirmationRefId,
    correlationId,
  }: {
    paymentFlowId: string
    confirmationRefId: string
    correlationId: string
  }): Promise<InferAttributes<PaymentFulfillment> | null> {
    try {
      const [updatedCount, [updatedPaymentFulfillment]] =
        await this.paymentFulfillmentModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              confirmationRefId: confirmationRefId,
              paymentFlowId: paymentFlowId,
              isDeleted: false,
            },
            returning: true,
          },
        )
      if (updatedCount > 0) {
        this.logger.info(
          `[${paymentFlowId}] Payment fulfillment marked as deleted (correlationId: ${correlationId})`,
        )
      } else {
        this.logger.warn(
          `[${paymentFlowId}] Payment fulfillment not found for deletion (correlationId: ${correlationId})`,
        )
      }

      return updatedPaymentFulfillment?.toJSON() ?? null
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] Failed to delete payment fulfillment (correlationId: ${correlationId})`,
        { error },
      )
      // Not re-throwing, to prevent disruption of a primary flow (e.g., refund)
      return null
    }
  }

  /**
   * Marks a card payment confirmation and its fulfillment as deleted, retrying each. Used when a
   * card payment is undone: by the payment saga rolling back, and by the worker finishing a
   * rollback that did not.
   *
   * The fulfillment is deleted even when deleting the confirmation fails: the confirmation id is
   * the correlationId, and an active fulfillment is what makes a flow look paid. A row that is
   * deleted already counts as done, so a retry after a lost response, or a second clean-up, is
   * not a failure. Throws when either is left active.
   */
  async deleteCardPaymentConfirmationAndFulfillment(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<void> {
    const retryOptions = {
      maxRetries: 3,
      retryDelayMs: 500,
      logger: this.logger,
    }

    const [confirmation, fulfillment] = await Promise.allSettled([
      retry(
        async () => {
          if (
            (await this.deleteCardPaymentConfirmation(
              paymentFlowId,
              correlationId,
            )) ||
            !(await this.cardPaymentDetailsModel.count({
              where: { id: correlationId, paymentFlowId, isDeleted: false },
            }))
          ) {
            return
          }
          throw new Error('Failed to delete payment confirmation')
        },
        {
          ...retryOptions,
          logPrefix: `[${paymentFlowId}] Delete payment confirmation`,
        },
      ),
      retry(
        async () => {
          if (
            (await this.deletePaymentFulfillment({
              paymentFlowId,
              confirmationRefId: correlationId,
              correlationId,
            })) ||
            !(await this.paymentFulfillmentModel.count({
              where: {
                confirmationRefId: correlationId,
                paymentFlowId,
                isDeleted: false,
              },
            }))
          ) {
            return
          }
          throw new Error('Failed to delete payment fulfillment')
        },
        {
          ...retryOptions,
          logPrefix: `[${paymentFlowId}] Delete payment fulfillment`,
        },
      ),
    ])

    for (const result of [confirmation, fulfillment]) {
      if (result.status === 'rejected') {
        throw result.reason
      }
    }
  }

  async restoreCardPaymentConfirmation(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<InferAttributes<CardPaymentDetails> | null> {
    const [updatedCount, [restoredCardPaymentDetails]] =
      await this.cardPaymentDetailsModel.update(
        { isDeleted: false },
        {
          where: {
            id: correlationId,
            paymentFlowId,
            isDeleted: true,
          },
          returning: true,
        },
      )

    if (updatedCount > 0) {
      this.logger.info(
        `[${paymentFlowId}] Payment confirmation restored (correlationId: ${correlationId})`,
      )
    } else {
      this.logger.warn(
        `[${paymentFlowId}] Payment confirmation not found for restore (correlationId: ${correlationId})`,
      )
    }

    return restoredCardPaymentDetails?.toJSON() ?? null
  }

  async restorePaymentFulfillment({
    paymentFlowId,
    confirmationRefId,
  }: {
    paymentFlowId: string
    confirmationRefId: string
  }): Promise<InferAttributes<PaymentFulfillment> | null> {
    const [updatedCount, [restoredPaymentFulfillment]] =
      await this.paymentFulfillmentModel.update(
        { isDeleted: false },
        {
          where: {
            confirmationRefId,
            paymentFlowId,
            isDeleted: true,
          },
          returning: true,
        },
      )

    if (updatedCount > 0) {
      this.logger.info(
        `[${paymentFlowId}] Payment fulfillment restored (confirmationRefId: ${confirmationRefId})`,
      )
    } else {
      this.logger.warn(
        `[${paymentFlowId}] Payment fulfillment not found for restore (confirmationRefId: ${confirmationRefId})`,
      )
    }

    return restoredPaymentFulfillment?.toJSON() ?? null
  }

  async searchPaymentFlows(
    payerNationalId?: string,
    search?: string,
    limit?: number,
    after?: string,
    before?: string,
  ): Promise<GetPaymentFlowsPaginatedDTO> {
    const where: WhereOptions<PaymentFlow> = { isDeleted: false }

    if (payerNationalId && isValid(payerNationalId)) {
      where.payerNationalId = payerNationalId
    }

    if (search && search !== '') {
      where.id = search
    }

    const paginatedResult = await paginate({
      Model: this.paymentFlowModel,
      primaryKeyField: 'id',
      orderOption: [['created', 'DESC']],
      where,
      after: after || '',
      before: before,
      limit: limit || 10,
      distinctCol: this.paymentFlowModel.primaryKeyAttribute,
      include: [
        {
          model: PaymentFlowCharge,
          as: 'charges',
        },
        {
          model: PaymentFlowDebt,
          as: 'debts',
        },
        {
          model: DebtSettlement,
          required: false,
        },
      ],
    })

    const paymentFlowDtos = await Promise.all(
      paginatedResult.data.map(async (flow) => {
        const paymentDetails = await this.getPaymentFlowAmountDetails(flow)
        const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
          flow,
        )
        const payerName = await this.getPayerName(flow.payerNationalId)

        return {
          ...flow.toJSON(),
          productTitle: flow.productTitle ?? paymentDetails.firstProductTitle,
          productPrice: paymentDetails.totalPrice,
          payerName,
          availablePaymentMethods:
            flow.availablePaymentMethods as PaymentMethod[],
          paymentStatus,
          updatedAt,
          isClosed: isDebtFlowClosed(flow.toJSON()),
          type: flow.type ?? 'charge',
        }
      }),
    )

    return {
      data: paymentFlowDtos,
      totalCount: paginatedResult.totalCount,
      pageInfo: paginatedResult.pageInfo,
    }
  }
}
