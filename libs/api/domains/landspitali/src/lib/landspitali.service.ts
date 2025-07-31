import { Injectable } from '@nestjs/common'
import {
  CreatePaymentFlowInputAvailablePaymentMethodsEnum,
  PaymentsApi,
} from '@island.is/clients/payments'
import { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'
import { CreateMemorialCardPaymentUrlResponse } from './dto/createMemorialCardPaymentUrl.response'

// eslint-disable-next-line local-rules/disallow-kennitalas
const LANDSPITALI_NATIONAL_ID = '5003002130'

@Injectable()
export class LandspitaliService {
  constructor(private readonly paymentsClient: PaymentsApi) {}

  async createMemorialCardPaymentUrl(
    input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    const locale = input.locale !== 'en' ? 'is' : 'en'
    const { urls } =
      await this.paymentsClient.paymentFlowControllerCreatePaymentUrl({
        createPaymentFlowInput: {
          // TODO: Verify this should be the product title
          // TODO: Perhaps fetch product title from somewhere else?
          productTitle:
            locale === 'is'
              ? 'Minningarsjóður Landspítali'
              : 'Landspítali Memorial Fund',
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
              chargeItemCode: 'MR101', // TODO: Styrktar- og gjafasjóður Landspítala (let's verify that is where the 500 kr fee should go)
              chargeType: 'memorialCardFee', // TODO: What is a charge type?
              quantity: 1,
            },
          ],
          payerNationalId: input.payerNationalId,
          organisationId: LANDSPITALI_NATIONAL_ID,
          onUpdateUrl: '', // TODO: Create a service that listens to the payment success webhook and forwards that info to zendesk
          // TODO: Find out just how much data should be in "extraData"
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
          metadata: {
            ...input,
          },
        },
      })

    return {
      url: urls[locale],
    }
  }
}
