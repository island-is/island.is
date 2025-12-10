import {
  CreateChargeParameters,
  PaymentCatalogItem,
  PaymentCatalogParameters,
} from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../../types'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { PaymentService as PaymentModelService } from '@island.is/application/api/payment'
import { TemplateApiError } from '@island.is/nest/problem'
import { getSlugFromType } from '@island.is/application/core'
import { getConfigValue } from '../../shared.utils'
import { ConfigService } from '@nestjs/config'
import { uuid } from 'uuidv4'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

@Injectable()
export class PaymentService extends BaseTemplateApiService {
  constructor(
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly paymentModelService: PaymentModelService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<SharedModuleConfig>,
  ) {
    super('Payment')
  }

  async paymentCatalog({
    params,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    if (!params?.organizationId) {
      throw Error('Missing performing organization ID')
    }
    const data = await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
      params.organizationId,
    )
    return data.item
  }

  async mockPaymentCatalog({
    params,
    application,
  }: TemplateApiModuleActionProps<PaymentCatalogParameters>): Promise<
    PaymentCatalogItem[]
  > {
    if (!params?.organizationId) {
      throw Error('Missing performing organization ID')
    }
    if (isRunningOnEnvironment('production')) {
      this.logger.warn('Attempt to use mock payments in production', {
        applicationId: application.id,
        organizationId: params?.organizationId,
      })
      throw new Error('Mock payments are not allowed in production')
    }

    this.logger.info('Using mock payment catalog', {
      applicationId: application.id,
      hasMockCatalog: !!params?.mockPaymentCatalog?.length,
    })
    if (params?.mockPaymentCatalog?.length) {
      const isValid = params.mockPaymentCatalog.every(
        (item): item is PaymentCatalogItem => {
          return (
            typeof item.performingOrgID === 'string' &&
            typeof item.chargeType === 'string' &&
            typeof item.chargeItemCode === 'string' &&
            typeof item.chargeItemName === 'string' &&
            typeof item.priceAmount === 'number'
          )
        },
      )
      if (!isValid) {
        throw new Error('Invalid mock payment catalog structure')
      }
      return params.mockPaymentCatalog
    } else {
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
  }

  async createCharge({
    application,
    auth,
    params,
    currentUserLocale,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const { organizationId, chargeItems, extraData } = params ?? {}
    const { shouldUseMockPayment } = application.answers

    if (shouldUseMockPayment && isRunningOnEnvironment('production')) {
      this.logger.warn('Attempt to use mock payments in production', {
        applicationId: application.id,
        organizationId: organizationId,
      })
      throw new Error('Mock payments are not allowed in production')
    }

    if (shouldUseMockPayment && !isRunningOnEnvironment('production')) {
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
        'mockuser4',
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
    if (!chargeItems) throw Error('No selected charge item code')

    const items =
      typeof chargeItems === 'function' ? chargeItems(application) : chargeItems

    const extraDataItems =
      typeof extraData === 'function' ? extraData(application) : extraData ?? []

    const response = await this.paymentModelService.createCharge(
      auth,
      organizationId,
      items,
      application.id,
      extraDataItems,
      currentUserLocale,
    )

    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }
    return response
  }

  async verifyPayment({
    application,
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const paymentStatus = await this.paymentModelService.getStatus(
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
  }: TemplateApiModuleActionProps<CreateChargeParameters>) {
    const payment = await this.paymentModelService.findPaymentByApplicationId(
      application.id,
    )

    if (!payment) {
      return // No payment found, nothing to do
    }

    const paymentUrl = (payment.definition as { paymentUrl: string })
      ?.paymentUrl as string

    try {
      const url = new URL(paymentUrl)
      const chargeId = url.pathname.split('/').pop()

      if (chargeId) {
        await this.chargeFjsV2ClientService.deleteCharge(chargeId)
      }

      await this.paymentModelService.delete(application.id, auth)
    } catch (error) {
      this.logger.error('Error deleting payment', {
        error,
        paymentUrl,
        applicationId: application.id,
      })
      throw error
    }
  }
}
