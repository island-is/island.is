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
    // Pretend to be doing stuff for a short while
    console.log('Before timeout')
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('After timeout')
    return 'hello my friend'
  }

  async getCriminalRecord({ application }: TemplateApiModuleActionProps) {
    throw new Error('CriminalRecord service threw error')
  }
}
