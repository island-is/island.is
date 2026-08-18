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

// Employee reads are paginated (a report can carry thousands) — fetched this
// many at a time while paging through the full set.
const DRAFT_EMPLOYEE_PAGE_SIZE = 200

const companyAdminGenderMap: Record<Gender, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
  [Gender.MALE]: 'MALE',
  [Gender.FEMALE]: 'FEMALE',
  [Gender.NON_BINARY]: 'NEUTRAL',
}

const mapGender = (gender?: string): 'MALE' | 'FEMALE' | 'NEUTRAL' =>
  companyAdminGenderMap[gender as Gender] ?? 'NEUTRAL'

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
    try {
      const blob =
        await this.directorateOfEqualityService.getBlankExcelTemplate(auth)
      const arrayBuffer = await blob.arrayBuffer()
      return {
        base64: Buffer.from(arrayBuffer).toString('base64'),
        filename: 'launagreining-sniðmát.xlsx',
      }
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get blank Excel template', {
        applicationId: application.id,
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

  async presignImportUpload({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.presignImportUpload(auth)
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to presign import upload', {
        applicationId: application.id,
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

  // Opens the DRAFT report at "initial contact" — idempotent on providerId
  // (application.id), so re-entering this part of the form (including on
  // reopen) safely returns the same draft rather than creating a duplicate.
  async createSalaryDraft({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.createDraft(auth, {
        type: ReportTypeEnum.SALARY,
        providerId: application.id,
      })
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to create salary report draft', {
        applicationId: application.id,
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

  // Bulk-seeds the draft's scoring content from the uploaded workbook
  // (REPLACE semantics on DMR's side). The response is only an ack — the UI
  // re-reads the relevant screen-shaped draft actions afterwards rather than
  // using this response to populate anything, so the parsed data is never
  // written into applicationAnswers.
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
    try {
      return await this.directorateOfEqualityService.importDraftWorkbook(
        auth,
        application.id,
        { key },
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to import salary report draft workbook', {
        applicationId: application.id,
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

  // Screen-shaped draft reads — each one just calls the matching client
  // method for the DMR draft (keyed by application.id as providerId).
  // Replaces the old aggregated `getSalaryDraftContent`, which fanned out
  // across DMR's per-collection paginated reads to assemble one big object;
  // DMR has since added endpoints shaped for exactly what each screen needs.

  async getDraftHeader({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getDraft(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get draft header', {
        applicationId: application.id,
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

  async getDraftCriteriaTree({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getDraftCriteriaTree(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get draft criteria tree', {
        applicationId: application.id,
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

  async listDraftRolesWithSteps({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.listDraftRolesWithSteps(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft roles with steps', {
        applicationId: application.id,
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

  async listDraftEmployeesWithSteps({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const providerId = application.id
    try {
      const employees = []
      let page = 1
      for (;;) {
        const res =
          await this.directorateOfEqualityService.listDraftEmployeesWithSteps(
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
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft employees with steps', {
        applicationId: application.id,
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

  async listDraftCriteria({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.listDraftCriteria(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft criteria', {
        applicationId: application.id,
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

  async listDraftRoles({ auth, application }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.listDraftRoles(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft roles', {
        applicationId: application.id,
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

  async listDraftEmployees({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const providerId = application.id
    try {
      const employees = []
      let page = 1
      for (;;) {
        const res = await this.directorateOfEqualityService.listDraftEmployees(
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
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft employees', {
        applicationId: application.id,
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

  async listDraftOutlierGroups({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.listDraftOutlierGroups(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to list draft outlier groups', {
        applicationId: application.id,
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

  // Live outlier/gender-score preview computed from the draft's current
  // scoring graph — no answers to map, DMR derives this from what's already
  // on the draft (criteria/sub-criteria/steps/roles/employees, all synced
  // there already).
  async analyzeSalaryReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      return await this.directorateOfEqualityService.getDraftAnalysis(
        auth,
        application.id,
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to analyze salary report', {
        applicationId: application.id,
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

  // Finalises the draft (DRAFT → SUBMITTED/POSTPONED). Everything past
  // `dataEntry` already lives on the draft via `syncSalaryDraft`; only the
  // pre-dataEntry answers (company/contact/headcount/period, still answers-
  // backed) need patching onto the draft header before submit.
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

    try {
      await this.directorateOfEqualityService.updateDraft(auth, providerId, {
        companyAdminName: answers.chiefExecutive?.name ?? '',
        companyAdminTitle: answers.chiefExecutive?.jobTitle ?? '',
        companyAdminEmail: answers.chiefExecutive?.email ?? '',
        companyAdminGender: mapGender(answers.chiefExecutive?.gender),
        contactName: answers.contactPerson?.name ?? '',
        contactEmail: answers.contactPerson?.email ?? '',
        contactPhone: answers.contactPerson?.phone ?? '',
        averageEmployeeMaleCount: Number(answers.employeeCount?.men) || 0,
        averageEmployeeFemaleCount: Number(answers.employeeCount?.women) || 0,
        averageEmployeeNeutralCount:
          Number(answers.employeeCount?.nonBinary) || 0,
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
            isatCategory: answers.generalInformation?.isatClassification ?? '',
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
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to submit salary report', {
        applicationId: application.id,
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

  async editOutliers({ auth, application }: TemplateApiModuleActionProps) {
    try {
      const answers = this.parseAnswers(
        salaryReportDataSchema,
        application.answers,
        application.id,
      )

      const groups = (answers.salaryAnalysis?.outlierGroups ?? [])
        .filter((g) => g.employeeOrdinals.length > 0)
        .map((g) => ({
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
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to edit outliers', {
        applicationId: application.id,
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

    try {
      return await this.directorateOfEqualityService.submitEqualityReport(
        auth,
        {
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
        errorDetails.status ?? 500,
      )
    }
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
    try {
      return await this.directorateOfEqualityService.submitReportComment(
        auth,
        application.id,
        { body },
      )
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to submit report comment', {
        applicationId: application.id,
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
}

const toNumberOrZero = (number: string | undefined) => {
  if (!number) {
    return 0
  }

  const parsed = Number(number)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}
