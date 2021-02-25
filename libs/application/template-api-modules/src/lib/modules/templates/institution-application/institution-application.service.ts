import { ImATeapotException, Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateApplicationEmail } from './emailGenerators'

@Injectable()
export class InstitutionApplicationService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) { }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationEmail,
      application,
    )
  }
}
