import { Injectable } from '@nestjs/common'
import {
  CaseApi,
  TokenMiddleware,
} from '@island.is/clients/data-protection-complaint'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
  ) {}

  get caseApiWithAuth() {
    return this.caseApi.withMiddleware(this.tokenMiddleware)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}
