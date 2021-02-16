import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { VistaSkjalModel } from '@island.is/api/domains/health-insurance'

@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  // async assignReviewer({ application }: TemplateApiModuleActionProps) {
  //   await this.sharedTemplateAPIService.assignApplicationThroughEmail(
  //     generateAssignReviewerEmail,
  //     application,
  //   )
  // }
  async applyInsurance({ application }: TemplateApiModuleActionProps): Promise<VistaSkjalModel>{
    const vistaskjal = new VistaSkjalModel()
    vistaskjal.isSucceeded = true
    return vistaskjal
  }
}
