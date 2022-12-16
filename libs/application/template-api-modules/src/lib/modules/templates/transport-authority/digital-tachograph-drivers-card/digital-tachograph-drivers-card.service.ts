import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  DigitalTachographDriversCardAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/digital-tachograph-drivers-card'
import {
  DrivingLicense,
  NationalRegistry,
  NationalRegistryCustom,
  QualityPhoto,
  QualitySignature,
} from './types'
import { YES } from '@island.is/application/core'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class DigitalTachographDriversCardService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
  ) {
    super(ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as DigitalTachographDriversCardAnswers,
      )

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
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

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as DigitalTachographDriversCardAnswers
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const nationalRegistryCustomData = application.externalData
      .nationalRegistryCustom?.data as NationalRegistryCustom
    const drivingLicenseData = application.externalData.drivingLicense
      ?.data as DrivingLicense
    const createChargeDate = application.externalData.createCharge?.date
    const qualityPhotoData = application.externalData.qualityPhoto
      ?.data as QualityPhoto
    const qualitySignatureData = application.externalData.qualitySignature
      ?.data as QualitySignature

    // Submit the application
    await this.digitalTachographDriversCardClient.saveDriversCard(auth, {
      ssn: auth.nationalId,
      fullName: nationalRegistryData?.fullName,
      address: nationalRegistryData?.address?.streetAddress,
      postalCode: nationalRegistryData?.address?.postalCode,
      place: nationalRegistryData?.address?.city,
      birthCountry: drivingLicenseData?.birthCountry,
      birthPlace: nationalRegistryCustomData?.birthPlace,
      emailAddress: answers.applicant.email,
      phoneNumber: answers.applicant.phone,
      deliveryMethodIsSend: answers.cardDelivery.deliveryMethodIsSend === YES,
      paymentReceivedAt: new Date(createChargeDate),
      photo: qualityPhotoData?.dataUri,
      signature: qualitySignatureData?.dataUri,
    })
  }
}
