import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import {
  Gender,
  type ApplicationAnswers,
} from '@island.is/application/templates/directorate-of-equality/equality-report'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

const LOGGING_CONTEXT = 'DirectorateOfEqualityService'

@Injectable()
export class DirectorateOfEqualityService extends BaseTemplateApiService {
  constructor(
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.EQUALITY_REPORT)
  }

  private extractFetchErrorDetails(error: unknown): Record<string, unknown> {
    if (error instanceof FetchError) {
      return {
        status: error.status,
        statusText: error.statusText,
        problem: error.problem,
      }
    }
    return {
      message: error instanceof Error ? error.message : String(error),
    }
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

  async getDoeCompany({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getCompany(auth)
    } catch (error) {
      this.logger.error('Failed to get company data from DOE, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { employeeCountCategory: 'UNKNOWN' }
    }
  }

  async getActiveEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const report =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch (error) {
      this.logger.error('Failed to get active equality report, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
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

    // `identifier` is set to the submitting application's id at submit time
    // (see submitEqualityReport below), the same value stored as `providerId`
    // — which is what getReport() looks up by.
    const providerId = getValueViaPath<string>(
      application.externalData,
      'activeEqualityReport.data.identifier',
    )
    if (!providerId) return null
    try {
      const report = await this.directorateOfEqualityService.getReport(
        auth,
        providerId,
      )
      return { equalityReportContent: report.equalityReportContent ?? '' }
    } catch (error) {
      this.logger.error(
        'Failed to get previous equality report content, falling back',
        {
          applicationId: application.id,
          context: LOGGING_CONTEXT,
          ...this.extractFetchErrorDetails(error),
        },
      )
      return null
    }
  }

  async submitEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as ApplicationAnswers

    const genderMap: Record<Gender, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
      [Gender.MALE]: 'MALE',
      [Gender.FEMALE]: 'FEMALE',
      [Gender.NON_BINARY]: 'NEUTRAL',
    }
    const equalityReportContent = getValueViaPath(
      answers,
      'goalsAndActions.customField',
      '',
    )

    const subsidiaryList = answers.subsidiaries?.list ?? []

    try {
      return await this.directorateOfEqualityService.submitEqualityReport(
        auth,
        {
          identifier: application.id,
          providerId: application.id,
          companyAdminName: answers.chiefExecutive?.name ?? '',
          companyAdminEmail: answers.chiefExecutive?.email ?? '',
          companyAdminGender: answers.chiefExecutive?.gender
            ? genderMap[answers.chiefExecutive.gender]
            : 'NEUTRAL',
          contactName: answers.contactPerson?.name ?? '',
          contactEmail: answers.contactPerson?.email ?? '',
          contactPhone: answers.contactPerson?.phone ?? '',
          equalityReportContent: equalityReportContent ?? '',
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
        },
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to submit equality report', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })

      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        (errorDetails.status as number) ?? 500,
      )
    }
  }
}
