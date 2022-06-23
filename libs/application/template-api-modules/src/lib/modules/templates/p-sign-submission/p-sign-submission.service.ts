import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { NationalRegistry } from './types'
import {
  ApplicationWithAttachments as Application,
  getValueViaPath,
} from '@island.is/application/core'
import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'
import { SharedTemplateApiService } from '../../shared'

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

const YES = 'yes'
@Injectable()
export class PSignSubmissionService {
  s3: S3
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    this.s3 = new S3()
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
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
          })
    const name = this.getName(application)
    const attachment: Attachment = {
      name,
      content,
    }
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: nationalRegistryData?.nationalId,
      phoneNumber: application.answers.phone as string,
      email: application.answers.email as string,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      city: nationalRegistryData?.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }
    const persons: Person[] = [person]

    const extraData: { [key: string]: string } =
      application.answers.deliveryMethod === 'sendHome'
        ? {
            Afhentingarmati: 'Sótt á næsta afgreiðslustað',
            StarfsstodID: application.answers.district as string,
          }
        : { Afhentingarmati: 'Sent með pósti' }

    const uploadDataName = 'pkort1.0'
    const uploadDataId = 'pkort1.0'

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(persons, attachment, extraData, uploadDataName, uploadDataId)
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })

    if (!result.success) {
      throw new Error(`Application submission failed`)
    }
    return { success: result.success, id: result.caseNumber }
  }

  private getName(application: Application): string {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry
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
    const fileName = (application.attachments as {
      [key: string]: string
    })[attachmentKey]

    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    const file = await this.s3
      .getObject({
        Bucket: uploadBucket,
        Key: key,
      })
      .promise()
    const fileContent = file.Body as Buffer
    return fileContent?.toString('base64') || ''
  }
}
