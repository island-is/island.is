import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class PayableDummyTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService, //private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createCharge({ application: { id }, authorization, }: TemplateApiModuleActionProps) {
    const result = await this.sharedTemplateAPIService.createCharge(
      authorization,
      id
    )

    return result
  }
}
