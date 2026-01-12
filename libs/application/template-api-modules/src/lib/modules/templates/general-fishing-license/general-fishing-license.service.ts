import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import {
  FishingLicenseService,
  mapFishingLicenseToCode,
  UmsoknirApi,
} from '@island.is/clients/fishing-license'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { error } from '@island.is/application/templates/general-fishing-license'
import { S3Service } from '@island.is/nest/aws'

@Injectable()
export class GeneralFishingLicenseService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fishingLicenceApi: FishingLicenseService,
    private readonly umsoknirApi: UmsoknirApi,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.GENERAL_FISHING_LICENSE)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const paymentStatus = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      this.logger.error(
        'Trying to submit General Fishing License application that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    try {
      const applicantNationalId = getValueViaPath(
        application.answers,
        'applicant.nationalId',
      ) as string
      const applicantPhoneNumber = getValueViaPath(
        application.answers,
        'applicant.phoneNumber',
      ) as string
      const applicantEmail = getValueViaPath(
        application.answers,
        'applicant.email',
      ) as string
      const registrationNumber = getValueViaPath(
        application.answers,
        'shipSelection.registrationNumber',
      ) as string
      const fishingLicense = getValueViaPath(
        application.answers,
        'fishingLicense.license',
      ) as string
      const date = getValueViaPath(
        application.answers,
        'fishingLicenseFurtherInformation.date',
      ) as string
      const area = getValueViaPath(
        application.answers,
        'fishingLicenseFurtherInformation.area',
      ) as string | undefined
      const roeNetStr = getValueViaPath(
        application.answers,
        'fishingLicenseFurtherInformation.railAndRoeNet.roenet',
        '',
      ) as string
      const railNetStr = getValueViaPath(
        application.answers,
        'fishingLicenseFurtherInformation.railAndRoeNet.railnet',
        '',
      ) as string
      const roeNet = parseInt(roeNetStr.trim().split('m').join(''), 10)
      const railNet = parseInt(railNetStr.trim().split('m').join(''), 10)
      const attachmentsRaw = getValueViaPath(
        application.answers,
        'fishingLicenseFurtherInformation.attachments',
        [],
      ) as Array<{ key: string; name: string }>

      const attachmentDict = application.attachments as {
        [key: string]: string
      }
      const attachments = await Promise.all(
        attachmentsRaw?.map(async (a) => {
          const filename = attachmentDict[a.key]
          const vidhengiBase64 = await this.s3Service.getFileContent(
            filename,
            'base64',
          )
          return {
            vidhengiBase64,
            vidhengiNafn: a.name,
            vidhengiTypa: a.name.split('.').pop(),
          }
        }) || [],
      )

      await this.umsoknirApi
        .withMiddleware(new AuthMiddleware(auth as Auth))
        .v1UmsoknirPost({
          umsokn: {
            umsaekjandiKennitala: applicantNationalId,
            simanumer: applicantPhoneNumber,
            email: applicantEmail,
            utgerdKennitala: applicantNationalId,
            skipaskrarnumer: parseInt(registrationNumber, 10),
            umbedinGildistaka: new Date(date),
            veidileyfiKodi: mapFishingLicenseToCode(fishingLicense),
            veidisvaediLykill: area,
            fjoldiNeta: railNet,
            teinalengd: roeNet,
            skraarVidhengi: attachments,
            fjarsyslaFaersluNumer: paymentStatus.paymentId,
          },
        })
      return { success: true }
    } catch (e) {
      this.logger.error(
        'Error submitting General Fishing License application to SÍ',
        e,
      )
      throw new Error('Villa kom upp við skil á umsókn.')
    }
  }

  async getShips({ auth }: TemplateApiModuleActionProps) {
    const ships = await this.fishingLicenceApi.getShips(auth.nationalId, auth)

    if (!ships || ships.length < 1) {
      throw new TemplateApiError(
        {
          title: error.noShipsFoundErrorTitle,
          summary: error.noShipsFoundError,
        },
        400,
      )
    }
    return { ships }
  }
}
