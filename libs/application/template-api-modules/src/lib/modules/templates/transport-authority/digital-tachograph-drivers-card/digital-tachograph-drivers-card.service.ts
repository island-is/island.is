import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { DigitalTachographDriversCardAnswers } from '@island.is/application/templates/transport-authority/digital-tachograph-drivers-card'
import {
  DigitalTachographFakeData,
  DrivingLicense,
  NationalRegistry,
  NationalRegistryBirthplace,
  QualityPhotoAndSignature,
} from './types'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { externalData } from '@island.is/application/templates/transport-authority/digital-tachograph-drivers-card'
import {
  getTodayDateWithMonthDiff,
  getUriFromImageStr,
} from './digital-tachograph-drivers-card.util'
import { TemplateApiError } from '@island.is/nest/problem'
import { logger } from '@island.is/logging'

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

    try {
      // Get photo and signature from SGS, they will do the lookup in this order:
      // 1. RLS ökuskírteinakerfi - qualityphoto (can take some time)
      // 2. RLS ökuskírteinakerfi - scannedphoto (comes in right away)
      // 3. SGS older application
      const photoAndSignatureSGS =
        await this.digitalTachographDriversCardClient.getPhotoAndSignature(auth)
      if (photoAndSignatureSGS?.photo && photoAndSignatureSGS?.signature) {
        result = {
          hasPhoto: true,
          photoDataUri: getUriFromImageStr(photoAndSignatureSGS.photo),
          hasSignature: true,
          signatureDataUri: getUriFromImageStr(photoAndSignatureSGS.signature),
        }
      }
    } catch (e) {
      if (e.response?.status === 404) {
        throw new TemplateApiError(
          {
            title: externalData.qualityPhotoAndSignature.missing,
            summary: externalData.qualityPhotoAndSignature.missing,
          },
          400,
        )
      } else {
        logger.error(
          'Error fetching quality photo and signature for digital tachograph drivers card',
          e,
        )

        throw new TemplateApiError(
          {
            title: externalData.qualityPhotoAndSignature.error,
            summary: externalData.qualityPhotoAndSignature.error,
          },
          400,
        )
      }
    }

    // If we dont get any photo + signature from SGS, we will will throw an error
    // so the user cannot continue (will allow upload in phase 2)
    if (!result?.hasPhoto || !result?.hasSignature) {
      throw new TemplateApiError(
        {
          title: externalData.qualityPhotoAndSignature.missing,
          summary: externalData.qualityPhotoAndSignature.missing,
        },
        400,
      )
    }

    return result
  }

  async getNewestDriversCard({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const fakeData = getValueViaPath<DigitalTachographFakeData>(
        application.answers,
        'fakeData',
      )
      if (fakeData?.useFakeDataDriversCard === YES) {
        if (fakeData.hasNewestDriversCard === YES) {
          return {
            ssn: auth.nationalId,
            cardNumber: 'fakeCardNumber',
            applicationCreatedAt: getTodayDateWithMonthDiff(-12),
            cardValidFrom: getTodayDateWithMonthDiff(-12),
            cardValidTo:
              fakeData.newestDriversCardIsExpired === NO
                ? getTodayDateWithMonthDiff(
                    Math.abs(fakeData.newestDriversCardExpiresInMonths || 1),
                  )
                : getTodayDateWithMonthDiff(-1),
            isValid:
              (fakeData.newestDriversCardIsExpired === NO &&
                fakeData.newestDriversCardIsValid) === YES,
          }
        } else {
          return null
        }
      }

      return await this.digitalTachographDriversCardClient.getNewestDriversCard(
        auth,
      )
    } catch (e) {
      logger.error(
        'Error fetching newest drivers card for digital tachograph drivers card',
        e,
      )

      throw new TemplateApiError(
        {
          title: externalData.newestDriversCard.error,
          summary: externalData.newestDriversCard.error,
        },
        400,
      )
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
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    try {
      const answers = application.answers as DigitalTachographDriversCardAnswers
      const nationalRegistryData = application.externalData.nationalRegistry
        ?.data as NationalRegistry
      const nationalRegistryBirthplaceData = application.externalData
        .nationalRegistryBirthplace?.data as NationalRegistryBirthplace
      const currentLicenseData = application.externalData.currentLicense
        ?.data as DrivingLicense
      const createChargeDate = application.externalData.createCharge?.date
      const qualityPhotoAndSignatureData = application.externalData
        .qualityPhotoAndSignature?.data as QualityPhotoAndSignature

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
        deliveryMethodIsSend:
          answers.cardDelivery?.deliveryMethodIsSend === YES,
        cardType: answers.cardTypeSelection.cardType,
        paymentReceivedAt: new Date(createChargeDate),
        photo: qualityPhotoAndSignatureData?.photoDataUri,
        signature: qualityPhotoAndSignatureData?.signatureDataUri,
        driverslicenceNumber: currentLicenseData?.id?.toString() || '',
        driverslicencePlaceOfPublication:
          currentLicenseData?.publishPlaceName || '',
        driverslicenceValidFrom: new Date(
          currentLicenseData?.issued || new Date().toISOString(),
        ),
        driverslicenceValidTo: new Date(
          currentLicenseData?.expires || new Date().toISOString(),
        ),
      })
    } catch (e) {
      logger.error(
        'Error submitting application for digital tachograph drivers card',
        e,
      )

      throw new TemplateApiError(
        {
          title: externalData.submit.error,
          summary: externalData.submit.error,
        },
        400,
      )
    }
  }
}
