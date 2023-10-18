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
  NationalRegistryBirthplace,
  QualityPhoto,
  QualitySignature,
} from './types'
import { YES } from '@island.is/application/core'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { externalData } from '@island.is/application/templates/transport-authority/digital-tachograph-drivers-card'
import { getUriFromImageStr } from './digital-tachograph-drivers-card.util'

@Injectable()
export class DigitalTachographDriversCardService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly drivingLicenseApi: DrivingLicenseApi,
  ) {
    super(ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD)
  }

  async getQualityPhotoAndSignature({ auth }: TemplateApiModuleActionProps) {
    let result: {
      hasPhoto: boolean
      photoDataUri?: string | null
      hasSignature: boolean
      signatureDataUri?: string | null
    } = {
      hasPhoto: false,
      hasSignature: false,
    }

    // Check if photo and signature exists in RLS database
    const hasQualityPhotoRLS = await this.drivingLicenseApi.getHasQualityPhoto({
      token: auth.authorization,
    })
    const hasQualitySignatureRLS =
      await this.drivingLicenseApi.getHasQualitySignature({
        token: auth.authorization,
      })

    // First we'll try to use photo and signature from the RLS database
    if (hasQualityPhotoRLS && hasQualitySignatureRLS) {
      const photo = await this.drivingLicenseApi.getQualityPhoto({
        token: auth.authorization,
      })
      const signature = await this.drivingLicenseApi.getQualitySignature({
        token: auth.authorization,
      })

      result = {
        hasPhoto: true,
        photoDataUri: getUriFromImageStr(photo?.data),
        hasSignature: true,
        signatureDataUri: getUriFromImageStr(signature?.data),
      }
    } else {
      // If not exists in RLS, then we need to check the SGS database and use that
      const qualityPhotoAndSignatureSGS =
        await this.digitalTachographDriversCardClient.getPhotoAndSignature(auth)
      if (
        qualityPhotoAndSignatureSGS?.photo &&
        qualityPhotoAndSignatureSGS?.signature
      ) {
        result = {
          hasPhoto: true,
          photoDataUri: getUriFromImageStr(qualityPhotoAndSignatureSGS.photo),
          hasSignature: true,
          signatureDataUri: getUriFromImageStr(
            qualityPhotoAndSignatureSGS.signature,
          ),
        }
      }
    }

    // Make sure user has quality photo and signature (from either RLS or SGS),
    // if not then user cannot continue (will allow upload in phase 2)
    if (!result?.hasPhoto || !result?.hasSignature) {
      return Promise.reject({
        reason: externalData.qualityPhotoAndSignature.missing.defaultMessage,
      })
    }

    return result
  }

  async getNewestDriversCard({ auth }: TemplateApiModuleActionProps) {
    return await this.digitalTachographDriversCardClient.getNewestDriversCard(
      auth,
    )
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as DigitalTachographDriversCardAnswers,
      )

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.SAMGONGUSTOFA,
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

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as DigitalTachographDriversCardAnswers
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
    const nationalRegistryBirthplaceData = application.externalData
      .nationalRegistryBirthplace?.data as NationalRegistryBirthplace
    const currentLicenseData = application.externalData.currentLicense
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
      birthCountry: currentLicenseData?.birthCountry,
      birthPlace: nationalRegistryBirthplaceData?.location,
      emailAddress: answers.applicant.email,
      phoneNumber: answers.applicant.phone,
      deliveryMethodIsSend: answers.cardDelivery.deliveryMethodIsSend === YES,
      paymentReceivedAt: new Date(createChargeDate),
      photo: qualityPhotoData?.dataUri,
      signature: qualitySignatureData?.dataUri,
    })
  }
}
