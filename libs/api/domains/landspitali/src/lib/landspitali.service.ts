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
  ) {}

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
          productTitle: locale === 'is' ? 'Minningarkort' : 'Memorial card',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.chargeItemCode,
              chargeType: 'memorialCard', // TODO: What is a charge type?
              quantity: 1,
            },
            {
              price: 500,
              chargeItemCode: FEE_CHARGE_ITEM_CODE,
              chargeType: 'memorialCardFee', // TODO: What is a charge type?
              quantity: 1,
            },
          ],
          payerNationalId: input.payerNationalId,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
          // TODO: Find out just how much data should be sent to FJS
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
            typeOfPayment: 'memorialCard',
          },
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
          productTitle: locale === 'is' ? 'Beinn styrkur' : 'Direct grant',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.grant,
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
          payerNationalId: input.payerNationalId,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
          // TODO: Find out just how much data should be sent to FJS
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
            typeOfPayment: 'directGrant',
          },
        },
      })

    return {
      url: response.urls[locale],
    }
  }
}
