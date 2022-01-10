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
  Application,
  getValueViaPath,
  FieldBaseProps,
} from '@island.is/application/core'
import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'

interface QualityPhotoData extends FieldBaseProps {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

const YES = 'yes'
@Injectable()
export class PSignSubmissionService {
  s3: S3
  constructor(private readonly syslumennService: SyslumennService) {
    this.s3 = new S3()
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const content: string =
      application.answers.qualityPhoto === YES
        ? ((application.externalData
            .qualityPhoto as unknown) as QualityPhotoData).data.qualityPhoto
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
            StarfsstodID: application.answers.district as string,
          }
        : {}

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

    return `p_kort_mynd_${nationalRegistryData?.nationalId}_${dateStr}.pdf`
  }

  private async getAttachments({
    application,
  }: TemplateApiModuleActionProps): Promise<string> {
    const attachments = getValueViaPath(
      application.answers,
      'attachments',
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
