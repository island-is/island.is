import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  OrderVehicleRegistrationCertificateAnswers,
  error as errorMessages,
  isSendToOtherAddress,
} from '@island.is/application/templates/transport-authority/order-vehicle-registration-certificate'
import {
  SendToAddress,
  VehiclePrintingClient,
} from '@island.is/clients/transport-authority/vehicle-printing'
import { getCountryByCode } from '@island.is/shared/utils'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

const LOGGING_CONTEXT = 'OrderVehicleRegistrationCertificateService'

const REQUIRED_ADDRESS_FIELDS = [
  'name',
  'address1',
  'postalCode',
  'city',
  'country',
] as const

@Injectable()
export class OrderVehicleRegistrationCertificateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePrintingClient: VehiclePrintingClient,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {
    super(ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE)
  }

  private getSendToAddress(
    answers: OrderVehicleRegistrationCertificateAnswers,
  ): SendToAddress | undefined {
    if (!isSendToOtherAddress(answers)) {
      return undefined
    }

    const address = answers.sendToAddress
    const sendToAddress = {
      name: address?.name?.trim(),
      address1: address?.address1?.trim(),
      address2: address?.address2?.trim() || undefined,
      apartment: address?.apartment?.trim() || undefined,
      postalCode: address?.postalCode?.trim(),
      city: address?.city?.trim(),
      country: getCountryByCode(address?.country ?? '')?.name,
    }

    const missingFields = REQUIRED_ADDRESS_FIELDS.filter(
      (field) => !sendToAddress[field],
    )

    if (missingFields.length > 0) {
      this.logger.error(
        'Incomplete send to address, registration card print not requested',
        {
          context: LOGGING_CONTEXT,
          missingFields,
        },
      )
      throw new TemplateApiError(
        {
          title: errorMessages.incompleteSendToAddressTitle,
          summary: errorMessages.incompleteSendToAddressSummary,
        },
        400,
      )
    }

    return sendToAddress
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers =
      application.answers as OrderVehicleRegistrationCertificateAnswers
    const permno = answers?.pickVehicle?.plate
    const sendToAddress = this.getSendToAddress(answers)

    try {
      await this.vehiclePrintingClient.requestRegistrationCardPrint(
        auth,
        permno,
        sendToAddress,
      )
    } catch (e) {
      this.logger.error('Failed to request registration card print', {
        context: LOGGING_CONTEXT,
        sendToOtherAddress: !!sendToAddress,
      })
      throw e
    }

    this.logger.debug('Requested registration card print', {
      context: LOGGING_CONTEXT,
      sendToOtherAddress: !!sendToAddress,
    })
  }
}
