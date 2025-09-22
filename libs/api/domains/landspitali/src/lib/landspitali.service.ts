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
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

// eslint-disable-next-line local-rules/disallow-kennitalas
const LANDSPITALI_NATIONAL_ID = '5003002130'
const FEE_CHARGE_ITEM_CODE = 'MR101'

@Injectable()
export class LandspitaliService {
  constructor(
    private readonly paymentsClient: PaymentsApi,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @Inject(LandspitaliApiModuleConfig.KEY)
    private readonly config: ConfigType<typeof LandspitaliApiModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getCatalog(): Promise<Catalog> {
    return this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
      LANDSPITALI_NATIONAL_ID,
    )
  }

  async createMemorialCardPaymentUrl(
    input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    if (input.fundChargeItemCode === FEE_CHARGE_ITEM_CODE) {
      this.logger.warn(
        'Landspitali fund charge item code is fee charge item code',
        {
          fundChargeItemCode: input.fundChargeItemCode,
        },
      )
      return {
        url: '',
      }
    }

    const locale = input.locale !== 'en' ? 'is' : 'en'
    const { urls } =
      await this.paymentsClient.paymentFlowControllerCreatePaymentUrl({
        createPaymentFlowInput: {
          productTitle:
            locale === 'is'
              ? 'Minningarkort - Landspítali'
              : 'Memorial Card - Landspítali',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          returnUrl:
            locale === 'is'
              ? 'https://island.is/s/landspitali'
              : 'https://island.is/en/o/landspitali',
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.fundChargeItemCode,
              chargeType: input.fundChargeItemCode.slice(0, 3),
              quantity: 1,
            },
            {
              price: 500,
              chargeItemCode: FEE_CHARGE_ITEM_CODE,
              chargeType: FEE_CHARGE_ITEM_CODE.slice(0, 3),
              quantity: 1,
            },
          ],
          organisationId: LANDSPITALI_NATIONAL_ID,
          payerNationalId:
            input.payerNationalId || this.config.paymentNationalIdFallback,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
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
            {
              name: 'inMemoryOf',
              value: input.inMemoryOf,
            },
          ],
          metadata: {
            ...input,
            paymentFlowType: PaymentType.MemorialCard,
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
    if (input.grantChargeItemCode === FEE_CHARGE_ITEM_CODE) {
      this.logger.warn(
        'Landspitali grant charge item code is fee charge item code',
        {
          grantChargeItemCode: input.grantChargeItemCode,
        },
      )
      return {
        url: '',
      }
    }

    const locale = input.locale !== 'en' ? 'is' : 'en'
    const response =
      await this.paymentsClient.paymentFlowControllerCreatePaymentUrl({
        createPaymentFlowInput: {
          productTitle:
            locale === 'is'
              ? 'Beinn styrkur - Landspítali'
              : 'Direct Grant - Landspítali',
          availablePaymentMethods: [
            CreatePaymentFlowInputAvailablePaymentMethodsEnum.card,
          ],
          charges: [
            {
              price: input.amountISK,
              chargeItemCode: input.grantChargeItemCode,
              chargeType: input.grantChargeItemCode.slice(0, 3),
              quantity: 1,
            },
            {
              price: 500,
              chargeItemCode: FEE_CHARGE_ITEM_CODE,
              chargeType: FEE_CHARGE_ITEM_CODE.slice(0, 3),
              quantity: 1,
            },
          ],
          returnUrl:
            locale === 'is'
              ? 'https://island.is/s/landspitali'
              : 'https://island.is/en/o/landspitali',
          payerNationalId:
            input.payerNationalId || this.config.paymentNationalIdFallback,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: this.config.paymentFlowEventCallbackUrl,
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
            {
              name: 'project',
              value: input.project,
            },
          ],
          metadata: {
            ...input,
            paymentFlowType: PaymentType.DirectGrant,
          } as DirectGrantPaymentFlowMetadata,
        },
      })

    return {
      url: response.urls[locale],
    }
  }
}
