import { Inject, Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { applicationToCaseRequest } from './data-protection-utils'
import { CaseApi } from '@island.is/clients/data-protection-complaint'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { DataProtectionComplaintAttachmentProvider } from './data-protection-attachments.provider'

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly caseApi: CaseApi,
    private readonly dataProtectionComplaintAttachmentProvider: DataProtectionComplaintAttachmentProvider,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = await this.dataProtectionComplaintAttachmentProvider.gatherAllAttachments(
      application,
    )
    const caseRequest = await applicationToCaseRequest(application, attachments)
    console.log(caseRequest)
    const newCase = await this.caseApi.createCase({
      requestData: caseRequest,
    })

    const getnewCase = await this.caseApi.getCase({
      requestData: { caseNumber: newCase.identifier },
    })

    throw new Error('STOP APPLICATION FROM SUBMITTING')
  }
}
