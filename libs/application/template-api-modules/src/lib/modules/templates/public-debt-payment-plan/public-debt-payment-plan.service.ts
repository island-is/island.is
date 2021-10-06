import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class PublicDebtPaymentPlanTemplateService {
  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Does nothing for now
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}
