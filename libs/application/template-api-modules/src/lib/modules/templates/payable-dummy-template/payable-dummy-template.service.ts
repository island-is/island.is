import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class PayableDummyTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id },
    authorization,
  }: TemplateApiModuleActionProps) {
    const result = await this.sharedTemplateAPIService.createCharge(
      authorization,
      id,
      'AY110'
    )

    return result
  }
}
