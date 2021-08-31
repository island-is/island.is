import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateConfirmationEmail } from './emailGenerators'

@Injectable()
export class ComplaintsToAlthingiOmbudsmanService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    // Send confirmation email to applicant
    await this.sharedTemplateAPIService.sendEmail(
      generateConfirmationEmail,
      application,
    )
  }
}
