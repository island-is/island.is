import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class CriminalRecordService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    console.log('halló')
    console.log(id)
    const result = this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AY101',
    )
    return result
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('TODO sendApplication')
  }

  async getCriminalRecord({ application }: TemplateApiModuleActionProps) {
    console.log('TODO getCriminalRecord')
  }
}
