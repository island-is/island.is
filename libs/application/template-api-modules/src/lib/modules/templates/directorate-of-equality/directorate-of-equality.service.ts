import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  type SubmitEqualityReportDto,
} from '@island.is/clients/directorate-of-equality'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

@Injectable()
export class DirectorateOfEqualityService extends BaseTemplateApiService {
  constructor(
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
  ) {
    super('DirectorateOfEquality')
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

  async getDoeCompany({ auth }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getCompany(auth)
    } catch {
      return { employeeCountCategory: 'UNKNOWN' }
    }
  }

  async getActiveEqualityReport({ auth }: TemplateApiModuleActionProps) {
    try {
      const report = await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch {
      return { hasActiveEqualityReport: false }
    }
  }

  async getEqualityReportTemplateHtml({ auth }: TemplateApiModuleActionProps) {
    return this.directorateOfEqualityService.getEqualityReportTemplateHtml(auth)
  }

  async getEqualityReportTemplateDocx({ auth }: TemplateApiModuleActionProps) {
    const blob = await this.directorateOfEqualityService.getEqualityReportTemplateDocx(auth)
    const arrayBuffer = await blob.arrayBuffer()
    return { base64: Buffer.from(arrayBuffer).toString('base64') }
  }

  async getBlankExcelTemplate({ auth }: TemplateApiModuleActionProps) {
    const blob = await this.directorateOfEqualityService.getBlankExcelTemplate(auth)
    const arrayBuffer = await blob.arrayBuffer()
    return {
      base64: Buffer.from(arrayBuffer).toString('base64'),
      filename: 'launagreining-sniðmát.xlsx',
    }
  }

  async parseSalaryReportWorkbook({ auth, application }: TemplateApiModuleActionProps) {
    const base64 = getValueViaPath<string>(application.answers, 'dataEntry.excelFile')
    if (!base64) {
      throw new Error('No Excel file found in answers')
    }
    const buffer = Buffer.from(base64, 'base64')
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    return this.directorateOfEqualityService.importSalaryReportWorkbook(auth, blob)
  }

  async submitEqualityReport({ auth, application }: TemplateApiModuleActionProps) {
    const body = application.answers as unknown as SubmitEqualityReportDto
    return this.directorateOfEqualityService.submitEqualityReport(auth, body)
  }
}
