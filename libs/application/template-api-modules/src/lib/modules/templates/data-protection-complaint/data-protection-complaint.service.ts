import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateApplicationApprovedEmail } from './emailGenerators'

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) { }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(application)
    console.log('------------Sending DataProtectionComplaintService Application----------------')
  }
}
