import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { FasteignirApi } from '@island.is/clients/assets'
import { NationalRegistry, RealEstateAddress } from './types'
import {
  ApplicationWithAttachments as Application,
  getValueViaPath,
} from '@island.is/application/core'
import { SharedTemplateApiService } from '../../shared'
import { generateTestEmail } from './emailGenerators'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'

@Injectable()
export class AnnouncementOfDeathService {
  constructor(
    private readonly nationalRegistryPersonApi: EinstaklingarApi,
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fasteignirApi: FasteignirApi,
  ) {}

  async sendTestEmail({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateTestEmail,
      application,
    )
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    return { success: true }
  }
}
