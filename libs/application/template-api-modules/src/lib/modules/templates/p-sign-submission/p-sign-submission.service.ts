import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
  CertificateInfoResponse,
} from '@island.is/clients/syslumenn'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'

export const QUALITY_PHOTO = `
query HasQualityPhoto {
  drivingLicenseQualityPhoto {
    dataUri
  }
}
`

interface QualityPhotoType {
  drivingLicenseQualityPhoto: {
    dataUri: string | null
  }
}

type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

type Photo = {
  qualityPhoto: string
  attachments: Array<{
    key: string
    name: string
  }>
}

type Delivery = {
  deliveryMethod: string
  district: string
}

@Injectable()
export class PSignSubmissionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.P_SIGN)
  }

  async doctorsNote({
    auth,
  }: TemplateApiModuleActionProps): Promise<CertificateInfoResponse> {
    const note = await this.syslumennService.getCertificateInfo(auth.nationalId)
    if (!note) {
      this.logger.warn('[p-sign]: Failed to get doctors note')
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    } else {
      return note
    }
  }

  async submitApplication({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    const content: string =
      (application.answers.photo as Photo)?.qualityPhoto === YES &&
      (application.externalData.qualityPhoto as HasQualityPhotoData)?.data
        ?.hasQualityPhoto
        ? ((
            await this.sharedTemplateAPIService
              .makeGraphqlQuery<QualityPhotoType>(
                auth.authorization,
                QUALITY_PHOTO,
              )
              .then((response) => response.json())
          ).data?.drivingLicenseQualityPhoto?.dataUri?.split(
            'base64,',
          )[1] as string)
        : await this.getAttachments({
            application,
            auth,
            currentUserLocale,
          })
    const name = this.getName(application)
    const attachments: Attachment[] = [
      {
        name,
        content,
      },
    ]
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: application.answers.phone as string,
      email: application.answers.email as string,
      homeAddress: nationalRegistryData?.address?.streetAddress || '',
      postalCode: nationalRegistryData?.address?.postalCode || '',
      city: nationalRegistryData?.address?.locality || '',
      signed: true,
      type: PersonType.Plaintiff,
    }

    const actors: Person[] = application.applicantActors.map((actor) => ({
      name: '',
      ssn: actor,
      phoneNumber: '',
      email: '',
      homeAddress: '',
      postalCode: '',
      city: '',
      signed: true,
      type: PersonType.CounterParty,
    }))

    const persons: Person[] = [person, ...actors]

    const delivery = application.answers.delivery as Delivery
    const extraData: { [key: string]: string } =
      delivery.deliveryMethod === 'sendHome'
        ? { Afhentingarmati: 'Sent með pósti' }
        : {
            Afhentingarmati: 'Sótt á næsta afgreiðslustað',
            Starfsstod: delivery.district as string,
          }

    const uploadDataName = 'pkort1.0'
    const uploadDataId = 'pkort1.0'

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(persons, attachments, extraData, uploadDataName, uploadDataId)
      .catch((e) => {
        this.logger.error('[p-sign]: Failed to upload data - ', e)
        return {
          success: false,
          errorMessage: e.message,
        }
      })

    if (!result.success) {
      this.logger.error('[p-sign]: Failed to upload data - ', result.message)
      throw new Error(`Application submission failed`)
    }
    return { success: result.success, id: result.caseNumber }
  }

  private getName(application: Application): string {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual
    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)

    return `p_kort_mynd_${nationalRegistryData?.nationalId}_${dateStr}.jpeg`
  }

  private async getAttachments({
    application,
  }: TemplateApiModuleActionProps): Promise<string> {
    const attachments = getValueViaPath(
      application.answers,
      'photo.attachments',
    ) as Array<{ key: string; name: string }>
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return Promise.reject({})
    }

    const attachmentKey = attachments[0].key
    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    const fileContent = await this.s3Service.getFileContent(fileName, 'base64')
    return fileContent || ''
  }
}
