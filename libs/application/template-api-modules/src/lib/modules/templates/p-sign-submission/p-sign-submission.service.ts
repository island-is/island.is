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
import { Application, getValueViaPath } from '@island.is/application/core'
import { FileStorageService } from '@island.is/file-storage'

@Injectable()
export class PSignSubmissionService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = await this.prepareAttachments(application)
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

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)
    const content = application.answers.photoAttachment as string
    const attachment: Attachment = {
      name: `p_kort_mynd_${nationalRegistryData?.nationalId}_${dateStr}.pdf`,
      content: content,
    }

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

  private async prepareAttachments(
    application: Application,
  ): Promise<{name: String, url: string}[]> {
    const attachments = getValueViaPath(
      application.answers,
      'attachments',
    ) as Array<{ key: string; name: string }>
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return []
    }

    return await Promise.all(
      attachments.map(async ({ key, name }) => {
        const url = (application.attachments as {
          [key: string]: string
        })[key]
        console.log(url)
        const signedUrl = await this.fileStorageService.getFileContentAsBase64(url)
        console.log(signedUrl)
        return { name, url: signedUrl }
      }),
    )
  }
}
