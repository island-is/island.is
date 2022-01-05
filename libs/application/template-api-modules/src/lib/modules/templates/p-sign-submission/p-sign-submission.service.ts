import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { NationalRegistry } from './types'
import { SharedTemplateApiService } from '../../shared'
import { Application, getValueViaPath, FieldBaseProps } from '@island.is/application/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

interface ContentData {
  getFileContentAsBase64: {
    content: string
  }
}

interface QualityPhotoData extends FieldBaseProps {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

const QUERY = `
query GetFileContentAsBase64($input: FileContentAsBase64Input!) {
  getFileContentAsBase64(input: $input) {
    content
  }
}
`
const YES = 'yes'
@Injectable()
export class PSignSubmissionService {
  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const content: string =
      application.answers.qualityPhoto === YES
        ? ((application.externalData.qualityPhoto as unknown) as QualityPhotoData).data.qualityPhoto
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
    auth,
  }: TemplateApiModuleActionProps): Promise<string> {
    const attachments = getValueViaPath(
      application.answers,
      'attachments',
    ) as Array<{ key: string; name: string }>
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return Promise.reject({})
    }

    const { key } = attachments[0]

    const contentData = await this.sharedTemplateAPIService
      .makeGraphqlQuery<ContentData>(auth.authorization, QUERY, {
        input: {
          id: application.id,
          key: key,
        },
      })
      .then((response) => response.json())

    if ('errors' in contentData) {
      this.logger.error(
        'Failed to get base64 content from image upload in P-sign submission service',
        contentData,
      )
      throw new Error('Failed to get base64 content from image upload')
    }

    return contentData.data?.getFileContentAsBase64.content as string
  }
}
