import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  type SubmitEqualityReportDto,
} from '@island.is/clients/directorate-of-equality'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class DirectorateOfEqualityService extends BaseTemplateApiService {
  constructor(
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
  ) {
    super(ApplicationTypes.EQUALITY_REPORT)
  }

  async getCompanyData({ auth }: TemplateApiModuleActionProps) {
    const company = await this.companyRegistryService.getCompany(
      auth.nationalId,
    )

    if (!company) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        404,
      )
    }

    return company
  }

  async getActiveEqualityReport({ auth }: TemplateApiModuleActionProps) {
    try {
      const report = await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch {
      return { hasActiveEqualityReport: false }
    }
  }

  async submitEqualityReport({ auth, application }: TemplateApiModuleActionProps) {
    // TODO: map application.answers to SubmitEqualityReportDto once form fields are built
    const body = application.answers as unknown as SubmitEqualityReportDto
    return this.directorateOfEqualityService.submitEqualityReport(auth, body)
  }
}
