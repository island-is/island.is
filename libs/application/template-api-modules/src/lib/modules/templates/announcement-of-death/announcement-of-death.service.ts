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
import { SharedTemplateApiService } from '../../shared'
import { generateTestEmail } from './emailGenerators'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'

@Injectable()
export class AnnouncementOfDeathSubmissionService {
  constructor(
    private readonly nationalRegistryPersonApi: EinstaklingarApi,
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendTestEmail({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateTestEmail,
      application,
    )
  }

  async getPerson({ application }: TemplateApiModuleActionProps) {
    console.log("CALLING MY SHARONA TO THE BLOODY THRONE-A")
    const person = await this.nationalRegistryPersonApi.einstaklingarGetForsja({id: "0101302989"})
    return person
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    return { success: true }
  }
}
