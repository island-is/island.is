import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../types'

import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from './emailGenerators'

@Injectable()
export class ReferenceTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignApplication({ application }: TemplateApiModuleActionProps) {
    console.log('Running sendApplication from ReferenceTemplate api module')
    console.log('\t-assignin application and sending application')
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignApplicationEmail,
      application,
    )
    console.log('\t\tdone')
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('Running sendApplication from ReferenceTemplate api module')

    console.log('\t-waiting for fake delay')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('\t\tdone')

    console.log('\t-assigning application')
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
    console.log('\t\tdone')
  }
}
