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
    auth,
  }: TemplateApiModuleActionProps) {
    const result = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AYXXX',
    )

    return result
  }
}
