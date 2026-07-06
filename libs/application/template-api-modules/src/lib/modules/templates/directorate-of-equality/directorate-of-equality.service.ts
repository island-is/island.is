import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  type CompanyDto,
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
      const report =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch {
      return { hasActiveEqualityReport: false }
    }
  }

  async getEqualityReportTemplateHtml({ auth }: TemplateApiModuleActionProps) {
    return this.directorateOfEqualityService.getEqualityReportTemplateHtml(auth)
  }

  async getEqualityReportTemplateDocx({ auth }: TemplateApiModuleActionProps) {
    const blob =
      await this.directorateOfEqualityService.getEqualityReportTemplateDocx(
        auth,
      )
    const arrayBuffer = await blob.arrayBuffer()
    return { base64: Buffer.from(arrayBuffer).toString('base64') }
  }

  async getPreviousEqualityReportContent({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const hasActiveReport = getValueViaPath<boolean>(
      application.externalData,
      'activeEqualityReport.data.hasActiveEqualityReport',
    )
    if (!hasActiveReport) return null

    const reportId = getValueViaPath<string>(
      application.externalData,
      'activeEqualityReport.data.id',
    )
    if (!reportId) return null

    try {
      const report = await this.directorateOfEqualityService.getReport(
        auth,
        reportId,
      )
      return { equalityReportContent: report.equalityReportContent ?? '' }
    } catch {
      return null
    }
  }

  async getBlankExcelTemplate({ auth }: TemplateApiModuleActionProps) {
    const blob = await this.directorateOfEqualityService.getBlankExcelTemplate(
      auth,
    )
    const arrayBuffer = await blob.arrayBuffer()
    return {
      base64: Buffer.from(arrayBuffer).toString('base64'),
      filename: 'launagreining-sniðmát.xlsx',
    }
  }

  async presignImportUpload({ auth }: TemplateApiModuleActionProps) {
    return this.directorateOfEqualityService.presignImportUpload(auth)
  }

  async parseSalaryReportWorkbook({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const key = getValueViaPath<string>(
      application.externalData,
      'importPresign.data.key',
    )
    if (!key) {
      throw new Error('No upload key found — presign the upload first')
    }
    return this.directorateOfEqualityService.importSalaryReportWorkbook(
      auth,
      key,
    )
  }

  async submitEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as Record<string, any>
    const doeCompany = getValueViaPath<CompanyDto>(
      application.externalData,
      'doeCompany.data',
    )

    const genderMap: Record<string, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
      MALE: 'MALE',
      FEMALE: 'FEMALE',
      NON_BINARY: 'NEUTRAL',
    }

    const equalityReportContent = (() => {
      const base64 = answers.information?.customField ?? ''
      try {
        return Buffer.from(base64, 'base64').toString('utf-8')
      } catch {
        return ''
      }
    })()

    const subsidiaryList: {
      nationalIdWithName: { name: string; nationalId: string }
    }[] = answers.subsidiaries?.list ?? []

    return this.directorateOfEqualityService.submitEqualityReport(auth, {
      identifier: application.id,
      providerId: doeCompany?.id ?? '',
      companyAdminName: answers.chiefExecutive?.name ?? '',
      companyAdminEmail: answers.chiefExecutive?.email ?? '',
      companyAdminGender:
        genderMap[answers.chiefExecutive?.gender] ?? 'NEUTRAL',
      contactName: answers.contactPerson?.name ?? '',
      contactEmail: answers.contactPerson?.email ?? '',
      contactPhone: answers.contactPerson?.phone ?? '',
      equalityReportContent,
      company: {
        name: answers.generalInformation?.companyName ?? '',
        nationalId: answers.generalInformation?.nationalId ?? '',
        address: answers.generalInformation?.address ?? '',
        city: answers.generalInformation?.municipality ?? '',
        postcode: answers.generalInformation?.postalCode ?? '',
        isatCategory: answers.generalInformation?.isatClassification ?? '',
      },
      subsidiaries:
        answers.subsidiaries?.includesSubsidiaries === 'yes'
          ? subsidiaryList.map((s) => ({
              name: s.nationalIdWithName.name,
              nationalId: s.nationalIdWithName.nationalId,
            }))
          : [],
    })
  }
}
