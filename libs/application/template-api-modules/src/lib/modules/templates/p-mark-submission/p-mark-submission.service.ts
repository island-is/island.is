import { Injectable } from '@nestjs/common'
import { PMarkService } from '@island.is/api/domains/p-mark'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { FormValue } from '@island.is/application/core'

@Injectable()
export class PMarkSubmissionService {
  constructor(
    private readonly pMarkService: PMarkService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application
    const nationalId = application.applicant

    return { success: true }
  }
}
