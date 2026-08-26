import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  Gender,
  dataSchema as equalityReportDataSchema,
} from '@island.is/application/templates/directorate-of-equality/equality-report'
import {
  dataSchema as salaryReportDataSchema,
  PERIOD_ONE_MONTH,
} from '@island.is/application/templates/directorate-of-equality/salary-report'
import { FetchError } from '@island.is/clients/middlewares'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ZodTypeAny, z } from 'zod'
import { mapGender, toNumberOrZero } from './directorate-of-equality.utils'

// Page size for walking listDraftEmployees to completion on salary-analysis screens.
const DRAFT_EMPLOYEE_PAGE_SIZE = 100

const LOGGING_CONTEXT = 'DirectorateOfEqualityService'

@Injectable()
export class DirectorateOfEqualityService extends BaseTemplateApiService {
  constructor(
    private readonly companyRegistryService: CompanyRegistryClientService,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super('DirectorateOfEquality')
  }

  private parseAnswers<S extends ZodTypeAny>(
    schema: S,
    answers: unknown,
    applicationId: string,
  ): z.infer<S> {
    const result = schema.safeParse(answers)
    if (!result.success) {
      this.logger.error('Invalid application answers', {
        applicationId,
        context: LOGGING_CONTEXT,
        issues: result.error.issues,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }
    return result.data
  }

  private extractFetchErrorDetails(error: unknown): {
    status?: number
    statusText?: string
    problem?: unknown
    message?: string
  } {
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

  // Runs `action`, logging and rethrowing as the standard TemplateApiError on failure.
  private async withTemplateApiError<T>(
    applicationId: string,
    errorMessage: string,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action()
    } catch (error) {
      // Already a well-formed TemplateApiError (e.g. from parseAnswers) —
      // preserve its own status/body instead of re-wrapping it as a 500.
      if (error instanceof TemplateApiError) {
        throw error
      }
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error(errorMessage, {
        applicationId,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        errorDetails.status ?? 500,
      )
    }
  }

  async getCompanyData({ auth, application }: TemplateApiModuleActionProps) {
    let company
    try {
      company = await this.companyRegistryService.getCompany(auth.nationalId)
    } catch (error) {
      this.logger.error('Failed to get company data from company registry', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      throw error
    }

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

  async getSubCriterionCatalog({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getSubCriterionCatalog(
        auth,
      )
    } catch (error) {
      this.logger.error('Failed to get sub-criterion catalog, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { entries: [], generalScale: [] }
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

  async getEqualityReportTemplateHtml({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getEqualityReportTemplateHtml(
        auth,
      )
    } catch (error) {
      this.logger.error('Failed to get equality report template html', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      throw error
    }
  }

  async getEqualityReportTemplateDocx({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const blob =
        await this.directorateOfEqualityService.getEqualityReportTemplateDocx(
          auth,
        )
      const arrayBuffer = await blob.arrayBuffer()
      return { base64: Buffer.from(arrayBuffer).toString('base64') }
    } catch (error) {
      this.logger.error('Failed to get equality report template docx', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      throw error
    }
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
      // TODO: PROVIDER ID VS COMPANY ID.
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

  async getBlankExcelTemplate({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to get blank Excel template',
      async () => {
        const blob =
          await this.directorateOfEqualityService.getBlankExcelTemplate(auth)
        const arrayBuffer = await blob.arrayBuffer()
        return {
          base64: Buffer.from(arrayBuffer).toString('base64'),
          filename: 'launagreining-sniðmát.xlsx',
        }
      },
    )
  }

  async presignImportUpload({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to presign import upload',
      () => this.directorateOfEqualityService.presignImportUpload(auth),
    )
  }

  // Idempotent on providerId — reopening this step returns the same draft.
  async createSalaryDraft({ auth, application }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to create salary report draft',
      () =>
        this.directorateOfEqualityService.createDraft(auth, {
          type: ReportTypeEnum.SALARY,
          providerId: application.id,
        }),
    )
  }

  // REPLACE semantics on DMR's side; response is just an ack, never stored in applicationAnswers.
  async importSalaryDraftWorkbook({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const key = getValueViaPath<string>(
      application.externalData,
      'importPresign.data.key',
    )
    if (!key) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }
    return this.withTemplateApiError(
      application.id,
      'Failed to import salary report draft workbook',
      () =>
        this.directorateOfEqualityService.importDraftWorkbook(
          auth,
          application.id,
          { key },
        ),
    )
  }

  // Screen-shaped draft reads, replacing the old aggregated getSalaryDraftContent.
  async getDraftHeader({ auth, application }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to get draft header',
      () => this.directorateOfEqualityService.getDraft(auth, application.id),
    )
  }

  async getDraftCriteriaTree({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to get draft criteria tree',
      () =>
        this.directorateOfEqualityService.getDraftCriteriaTree(
          auth,
          application.id,
        ),
    )
  }

  async listDraftRolesWithSteps({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to list draft roles with steps',
      () =>
        this.directorateOfEqualityService.listDraftRolesWithSteps(
          auth,
          application.id,
        ),
    )
  }

  async listDraftCriteria({ auth, application }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to list draft criteria',
      () =>
        this.directorateOfEqualityService.listDraftCriteria(
          auth,
          application.id,
        ),
    )
  }

  async listDraftRoles({ auth, application }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to list draft roles',
      () =>
        this.directorateOfEqualityService.listDraftRoles(auth, application.id),
    )
  }

  // Salary-analysis screens need a full employee list: outlier-group
  // management needs the id<->ordinal mapping, and the extra-pay table derives
  // its totals from the same draft rows.
  async listDraftEmployees({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const providerId = application.id
    return this.withTemplateApiError(
      application.id,
      'Failed to list draft employees',
      async () => {
        const employees = []
        let page = 1
        for (;;) {
          const res =
            await this.directorateOfEqualityService.listDraftEmployees(
              auth,
              providerId,
              page,
              DRAFT_EMPLOYEE_PAGE_SIZE,
            )
          employees.push(...res.employees)
          if (res.employees.length === 0 || !res.paging.hasNextPage) {
            break
          }
          page += 1
        }
        return { employees }
      },
    )
  }

  async listDraftOutlierGroups({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to list draft outlier groups',
      () =>
        this.directorateOfEqualityService.listDraftOutlierGroups(
          auth,
          application.id,
        ),
    )
  }

  // Live preview computed by DMR from the draft's current scoring graph — no answers to map.
  async analyzeSalaryReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to analyze salary report',
      () =>
        this.directorateOfEqualityService.getDraftAnalysis(
          auth,
          application.id,
        ),
    )
  }

  // Finalises the draft; only the pre-dataEntry answers need patching onto it first.
  async submitSalaryReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = this.parseAnswers(
      salaryReportDataSchema,
      application.answers,
      application.id,
    )

    const equalityReportId = getValueViaPath<string>(
      application.externalData,
      'activeEqualityReport.data.id',
    )
    if (!equalityReportId) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }

    const providerId = application.id
    const subsidiaryList = answers.subsidiaries?.list ?? []
    const salaryDataBasis =
      answers.period?.period === PERIOD_ONE_MONTH ? 'MONTH' : 'AVERAGE'
    const salaryDataPeriod =
      salaryDataBasis === 'MONTH' &&
      answers.period?.year &&
      answers.period.month
        ? `${answers.period.year}-${answers.period.month.padStart(2, '0')}-01`
        : null

    return this.withTemplateApiError(
      application.id,
      'Failed to submit salary report',
      async () => {
        await this.directorateOfEqualityService.updateDraft(auth, providerId, {
          companyAdminName: answers.chiefExecutive?.name ?? '',
          companyAdminTitle: answers.chiefExecutive?.jobTitle ?? '',
          companyAdminEmail: answers.chiefExecutive?.email ?? '',
          companyAdminGender: mapGender(answers.chiefExecutive?.gender),
          contactName: answers.contactPerson?.name ?? '',
          contactEmail: answers.contactPerson?.email ?? '',
          contactPhone: answers.contactPerson?.phone ?? '',
          salaryDataBasis,
          salaryDataPeriod,
        })

        return await this.directorateOfEqualityService.submitDraft(
          auth,
          providerId,
          {
            company: {
              name: answers.generalInformation?.companyName ?? '',
              nationalId: answers.generalInformation?.nationalId ?? '',
              address: answers.generalInformation?.address ?? '',
              city: answers.generalInformation?.municipality ?? '',
              postcode: answers.generalInformation?.postalCode ?? '',
              isatCategory:
                answers.generalInformation?.isatClassification ?? '',
            },
            subsidiaries:
              answers.subsidiaries?.includesSubsidiaries === 'yes'
                ? subsidiaryList.map((s) => ({
                    name: s.nationalIdWithName.name,
                    nationalId: s.nationalIdWithName.nationalId,
                  }))
                : [],
            equalityReportId,
            outliersPostponed:
              answers.salaryAnalysis?.postponed?.includes(YES) ?? false,
          },
        )
      },
    )
  }

  async editOutliers({ auth, application }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to edit outliers',
      async () => {
        const answers = this.parseAnswers(
          salaryReportDataSchema,
          application.answers,
          application.id,
        )

        const groups = (answers.salaryAnalysis?.outlierGroups ?? [])
          .filter((g) => g.employeeOrdinals.length > 0)
          .map((g) => ({
            name: g.name,
            reason: g.reason ?? '',
            action: g.action ?? '',
            signatureName: g.signatureName ?? '',
            signatureRole: g.signatureRole ?? '',
            employeeOrdinals: g.employeeOrdinals,
          }))

        await this.directorateOfEqualityService.editOutliers(
          auth,
          application.id,
          {
            groups,
          },
        )
      },
    )
  }

  async submitEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = this.parseAnswers(
      equalityReportDataSchema,
      application.answers,
      application.id,
    )

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

    return this.withTemplateApiError(
      application.id,
      'Failed to submit equality report',
      () =>
        this.directorateOfEqualityService.submitEqualityReport(auth, {
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
          averageEmployeeFemaleCount: toNumberOrZero(
            answers.employeeCount?.women,
          ),
          averageEmployeeMaleCount: toNumberOrZero(answers.employeeCount?.men),
          averageEmployeeNeutralCount: toNumberOrZero(
            answers.employeeCount?.nonBinary,
          ),

          subsidiaries:
            answers.subsidiaries?.includesSubsidiaries === 'yes'
              ? subsidiaryList.map((s) => ({
                  name: s.nationalIdWithName.name,
                  nationalId: s.nationalIdWithName.nationalId,
                }))
              : [],
        }),
    )
  }

  // Narrow in-place edit — PUTs just the report's narrative content, unlike
  // submitEqualityReport's full create call. This is what DRAFT_RETRY's
  // onExit uses: submitEqualityReport is a one-shot create (POST .../reports/
  // equality), not something a revision can safely re-invoke.
  async editEqualityContent({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to edit equality content',
      async () => {
        const answers = this.parseAnswers(
          equalityReportDataSchema,
          application.answers,
          application.id,
        )

        const equalityReportContent = getValueViaPath<string>(
          answers,
          'goalsAndActions.customField',
          '',
        )

        await this.directorateOfEqualityService.editEqualityContent(
          auth,
          application.id,
          {
            equalityReportContent: equalityReportContent ?? '',
          },
        )
      },
    )
  }

  async getReportComments({ auth, application }: TemplateApiModuleActionProps) {
    try {
      const comments =
        await this.directorateOfEqualityService.getReportComments(
          auth,
          application.id,
        )
      return comments
    } catch (error) {
      this.logger.error('Failed to get report comments, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return []
    }
  }

  async submitReportComment({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const body = getValueViaPath<string>(
      application.answers,
      'comment.newMessage',
    )
    if (!body) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.defaultTemplateApiError,
        },
        400,
      )
    }
    return this.withTemplateApiError(
      application.id,
      'Failed to submit report comment',
      () =>
        this.directorateOfEqualityService.submitReportComment(
          auth,
          application.id,
          { body },
        ),
    )
  }
}
