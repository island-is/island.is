import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateApplicationApprovedEmail } from './emailGenerators'

@Injectable()
export class FinancialAidService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
}
