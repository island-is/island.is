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


@Injectable()
export class AnnouncementOfDeathSubmissionService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    return { success: true}
  }

}
