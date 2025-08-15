import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import {
  CreatePaymentFlowInputAvailablePaymentMethodsEnum,
  PaymentsApi,
} from '@island.is/clients/payments'
import { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'
import { CreateMemorialCardPaymentUrlResponse } from './dto/createMemorialCardPaymentUrl.response'
import { CreateDirectGrantPaymentUrlInput } from './dto/createDirectGrantPaymentUrl.input'
import { CreateDirectGrantPaymentUrlResponse } from './dto/createDirectGrantPaymentUrl.response'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { Catalog } from './dto/catalog.response'
import { LandspitaliApiModuleConfig } from './landspitali.config'
import {
  type DirectGrantPaymentFlowMetadata,
  type MemorialCardPaymentFlowMetadata,
  PaymentType,
} from './types'
import { EmailService } from '@island.is/email-service'
import {
  DirectGrantPaymentConfirmationInput,
  MemorialCardPaymentConfirmationInput,
} from './dto/paymentConfirmation.input'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  generateDirectGrantPaymentConfirmationEmailMessage,
  generateMemorialCardPaymentConfirmationEmailMessage,
} from './utils'

// eslint-disable-next-line local-rules/disallow-kennitalas
const LANDSPITALI_NATIONAL_ID = '5003002130'
const FEE_CHARGE_ITEM_CODE = 'MR101' // Styrktar- og gjafasjóður Landspítala (TODO: let's verify that is where the 500 kr fee should go)

@Injectable()
export class LandspitaliService {
  constructor(
    private readonly paymentsClient: PaymentsApi,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @Inject(LandspitaliApiModuleConfig.KEY)
    private readonly config: ConfigType<typeof LandspitaliApiModuleConfig>,
    private readonly emailService: EmailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async sendDirectGrantPaymentConfirmationEmail(
    input: DirectGrantPaymentConfirmationInput,
  ): Promise<boolean> {
    if (input.validationSecret !== this.config.webValidationSecret) {
      this.logger.warn(
        'Invalid web validation secret for direct grant payment confirmation email',
      )
      return false
    }
    try {
      await this.emailService.sendEmail({
        to: this.config.paymentConfirmationSendToEmail,
        from: this.config.paymentConfirmationSendFromEmail,
        subject: this.config.directGrantPaymentConfirmationSubject,
        text: generateDirectGrantPaymentConfirmationEmailMessage(input),
        replyTo: input.payerEmail,
      })
      return true
    } catch (error) {
      this.logger.error(
        'Failed to send Landspítali direct grant payment confirmation email',
        { message: error.message },
      )
      return false
    }
  }

  async sendMemorialCardPaymentConfirmationEmail(
    input: MemorialCardPaymentConfirmationInput,
  ): Promise<boolean> {
    if (input.validationSecret !== this.config.webValidationSecret) {
      this.logger.warn(
        'Invalid web validation secret for memorial card payment confirmation email',
      )
      return false
    }
    try {
      await this.emailService.sendEmail({
        to: this.config.paymentConfirmationSendToEmail,
        from: this.config.paymentConfirmationSendFromEmail,
        subject: this.config.memorialCardPaymentConfirmationSubject,
        text: generateMemorialCardPaymentConfirmationEmailMessage(input),
        replyTo: input.payerEmail,
      })
      return true
    } catch (error) {
      this.logger.error(
        'Failed to send Landspítali memorial card payment confirmation email',
        { message: error.message },
      )
      return false
    }
  }

  async getCatalog(): Promise<Catalog> {
    return this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
      LANDSPITALI_NATIONAL_ID,
    )
  }

  async createMemorialCardPaymentUrl(
    input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    const locale = input.locale !== 'en' ? 'is' : 'en'
    const { urls } =
      await this.paymentsClient.paymentFlowControllerCreatePaymentUrl({
        createPaymentFlowInput: {
          // TODO: Verify this should be the product title
          // TODO: Perhaps fetch product title from somewhere else?
          // TODO: Should the product title be localized?
          productTitle: 'Minningarkort - Landspítali',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.fundChargeItemCode,
              chargeType: 'MemorialCard', // TODO: Verify this is the correct charge type
              quantity: 1,
            },
            {
              price: 500,
              chargeItemCode: FEE_CHARGE_ITEM_CODE,
              chargeType: 'MemorialCardFee', // TODO: Verify this is the correct charge type
              quantity: 1,
            },
          ],
          payerNationalId:
            input.payerNationalId ?? this.config.paymentNationalIdFallback,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
          // TODO: Find out just how much data should be sent to FJS and how that data should be structured
          extraData: [
            {
              name: 'recipientName',
              value: input.recipientName,
            },
            {
              name: 'recipientAddress',
              value: input.recipientAddress,
            },
            {
              name: 'recipientPostalCode',
              value: input.recipientPostalCode,
            },
            {
              name: 'recipientPlace',
              value: input.recipientPlace,
            },
            {
              name: 'payerName',
              value: input.payerName,
            },
            {
              name: 'payerEmail',
              value: input.payerEmail,
            },
            {
              name: 'payerAddress',
              value: input.payerAddress,
            },
            {
              name: 'payerPostalCode',
              value: input.payerPostalCode,
            },
            {
              name: 'payerPlace',
              value: input.payerPlace,
            },
            {
              name: 'senderSignature',
              value: input.senderSignature,
            },
          ],
          // TODO: Find out just how much data should be sent to Zendesk
          metadata: {
            ...input,
            landspitaliPaymentType: PaymentType.MemorialCard,
          } as MemorialCardPaymentFlowMetadata,
        },
      })

    return {
      url: urls[locale],
    }
  }

  async createDirectGrantPaymentUrl(
    input: CreateDirectGrantPaymentUrlInput,
  ): Promise<CreateDirectGrantPaymentUrlResponse> {
    const locale = input.locale !== 'en' ? 'is' : 'en'
    const response =
      await this.paymentsClient.paymentFlowControllerCreatePaymentUrl({
        createPaymentFlowInput: {
          productTitle: 'Beinn styrkur - Landspítali',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.grantChargeItemCode,
              chargeType: 'directGrant', // TODO: What is a charge type?
              quantity: 1,
            },
            {
              price: 500,
              chargeItemCode: FEE_CHARGE_ITEM_CODE,
              chargeType: 'directGrantFee', // TODO: What is a charge type?
              quantity: 1,
            },
          ],
          payerNationalId:
            input.payerNationalId ?? this.config.paymentNationalIdFallback,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
          // TODO: Find out just how much data should be sent to FJS and how that data should be structured
          extraData: [
            {
              name: 'payerName',
              value: input.payerName,
            },
            {
              name: 'payerEmail',
              value: input.payerEmail,
            },
            {
              name: 'payerAddress',
              value: input.payerAddress,
            },
            {
              name: 'payerPostalCode',
              value: input.payerPostalCode,
            },
            {
              name: 'payerPlace',
              value: input.payerPlace,
            },
            {
              name: 'payerGrantExplanation',
              value: input.payerGrantExplanation,
            },
          ],
          // TODO: Find out just how much data should be sent to Zendesk
          metadata: {
            ...input,
            landspitaliPaymentType: PaymentType.DirectGrant,
          } as DirectGrantPaymentFlowMetadata,
        },
      })

    return {
      url: response.urls[locale],
    }
  }
}
