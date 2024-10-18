import {
  CreateChargeParameters,
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../../types'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { PaymentService as PaymentModelService } from '@island.is/application/api/payment'
import { TemplateApiError } from '@island.is/nest/problem'
import { getSlugFromType, getValueViaPath } from '@island.is/application/core'
import { getConfigValue } from '../../shared.utils'
import { ConfigService } from '@nestjs/config'
import { uuid } from 'uuidv4'

@Injectable()
export class PaymentService extends BaseTemplateApiService {
  constructor(
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private readonly paymentModelService: PaymentModelService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<SharedModuleConfig>,
  ) {
    super('Payment')
  }

  async paymentCatalog({
    params,
    application,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    const { enableMockPayment } = application.externalData

    if (enableMockPayment.data) {
      return [
        {
          performingOrgID: params?.organizationId ?? 'string',
          chargeType: 'string',
          chargeItemCode: 'Payment',
          chargeItemName: 'Mock',
          priceAmount: 123123,
        },
      ]
    } else {
      if (!params?.organizationId) {
        throw Error('Missing performing organization ID')
      }
      const data =
        await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
          params.organizationId,
        )

      return data.item
    }
  }

  async mockPaymentCatalog({
    params,
    application,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    return [
      {
        performingOrgID: params?.organizationId ?? 'string',
        chargeType: 'string',
        chargeItemCode: 'Payment',
        chargeItemName: 'Mock',
        priceAmount: 123123,
      },
    ]
  }

  async createCharge({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const { organizationId, chargeItemCodes, extraData } = params ?? {}
    const { shouldUseMockPayment } = application.answers

    if (shouldUseMockPayment) {
      const list = [
        {
          performingOrgID: organizationId ?? 'string',
          chargeType: ' string',
          chargeItemCode: 'string',
          chargeItemName: 'string',
          priceAmount: 123123,
        },
      ]

      const result = await this.paymentModelService.createPaymentModel(
        list,
        application.id,
        organizationId ?? 'string',
      )

      await this.paymentModelService.setUser4(
        application.id,
        result.id,
        'newser4',
      )

      await this.paymentModelService.fulfillPayment(
        result.id,
        result.reference_id ?? uuid(),
        application.id,
      )

      const slug = getSlugFromType(application.typeId)

      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      return {
        id: result.id,
        paymentUrl: `${clientLocationOrigin}/${slug}/${application.id}`,
      }
    }

    if (!organizationId) throw Error('Missing performing organization ID')
    if (!chargeItemCodes) throw Error('No selected charge item code')

    const codes =
      typeof chargeItemCodes === 'function'
        ? chargeItemCodes(application)
        : chargeItemCodes

    const extraDataItems =
      typeof extraData === 'function' ? extraData(application) : extraData ?? []

    const response = await this.paymentModelService.createCharge(
      auth,
      organizationId,
      codes,
      application.id,
      extraDataItems,
    )

    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }
    return response
  }

  async verifyPayment({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const paymentStatus = await this.paymentModelService.getStatus(
      auth,
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      throw new TemplateApiError(
        {
          title: 'Payment not completed',
          description:
            'Ekki er hægt að halda áfram umsókn af því að ekki hefur tekist að taka við greiðslu.',
        },
        500,
      )
    }
  }

  async deletePayment({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const payment = await this.paymentModelService.findPaymentByApplicationId(
      application.id,
    )

    if (!payment) {
      return // No payment found, nothing to do
    }

    await this.chargeFjsV2ClientService.deleteCharge(payment.id)
    await this.paymentModelService.delete(application.id, auth)
  }
}
