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
import { dataSchema as equalityReportDataSchema } from '@island.is/application/templates/directorate-of-equality/equality-report'
import {
  dataSchema as salaryReportDataSchema,
  messages as salaryReportMessages,
  PERIOD_ONE_MONTH,
} from '@island.is/application/templates/directorate-of-equality/salary-report'
import { FetchError } from '@island.is/clients/middlewares'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
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
    private readonly applicationApiService: ApplicationApiService,
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
    body?: unknown
    message?: string
  } {
    if (error instanceof FetchError) {
      return {
        status: error.status,
        statusText: error.statusText,
        problem: error.problem,
        body: error.body,
      }
    }
    return {
      message: error instanceof Error ? error.message : String(error),
    }
  }

  private getApiErrorBody(
    error: unknown,
  ): { details?: unknown; translatedMessage?: unknown } | undefined {
    if (!(error instanceof FetchError)) return undefined
    return error.body as
      | { details?: unknown; translatedMessage?: unknown }
      | undefined
  }

  // DMR returns per-row workbook validation messages in ApiErrorDto.details —
  // unlike the rest of a FetchError body, these are meant for the applicant to
  // read and act on, so they're the one case worth surfacing instead of the
  // generic error.
  private extractApiErrorDetails(error: unknown): string[] | undefined {
    const details = this.getApiErrorBody(error)?.details
    if (!Array.isArray(details)) return undefined
    const strings = details.filter(
      (detail): detail is string =>
        typeof detail === 'string' && detail.trim().length > 0,
    )
    return strings.length > 0 ? strings : undefined
  }

  // ApiErrorDto.translatedMessage is explicitly documented as user-facing and
  // localized — safe to show directly, unlike the rest of the error body.
  private extractApiErrorTranslatedMessage(error: unknown): string | undefined {
    const translatedMessage = this.getApiErrorBody(error)?.translatedMessage
    return typeof translatedMessage === 'string' &&
      translatedMessage.trim().length > 0
      ? translatedMessage
      : undefined
  }

  // Runs `action`, logging and rethrowing as the standard TemplateApiError on
  // failure. `surfaceApiErrorDetails` opts in to forwarding ApiErrorDto.details
  // to the applicant (e.g. workbook validation errors) instead of the generic
  // message — only safe where the backend's details are user-facing.
  private async withTemplateApiError<T>(
    applicationId: string,
    errorMessage: string,
    action: () => Promise<T>,
    options?: { surfaceApiErrorDetails?: boolean },
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

      const apiErrorDetails = options?.surfaceApiErrorDetails
        ? this.extractApiErrorDetails(error)
        : undefined

      throw new TemplateApiError(
        apiErrorDetails
          ? apiErrorDetails.map((detail) => ({
              title: detail,
              summary: detail,
            }))
          : {
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
      // getActiveEqualityReport already surfaces DMR's company-not-found
      // error on this same prerequisites screen (both templates) — stay
      // silent here so it isn't shown a second time.
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
      // getActiveEqualityReport already surfaces DMR's company-not-found
      // error on this same prerequisites screen — stay silent here so it
      // isn't shown a second time; the sub-criteria list just comes up empty.
      this.logger.error('Failed to get sub-criterion catalog, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { entries: [], generalScale: [] }
    }
  }

  // The one DMR-backed prerequisite provider shared by both the
  // salary-report and equality-report templates — the single place that
  // surfaces DMR's curated translatedMessage (e.g. "company not found").
  // Every other DMR-backed provider on these screens (getDoeCompany,
  // getSubCriterionCatalog, getBlankExcelTemplate) suppresses it instead of
  // duplicating the alert.
  async getActiveEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const report =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      return { hasActiveEqualityReport: true, ...report }
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get active equality report, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })

      const translatedMessage = this.extractApiErrorTranslatedMessage(error)
      if (translatedMessage) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.errorDataProvider,
            summary: translatedMessage,
          },
          errorDetails.status ?? 500,
        )
      }
      return { hasActiveEqualityReport: false }
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
    // Propagates rather than falling back to null, so the screen can tell
    // "no earlier plan" (null) from "DMR did not answer".
    return this.withTemplateApiError(
      application.id,
      'Failed to get previous equality report content',
      async () => {
        const activeReport =
          await this.directorateOfEqualityService.getActiveEqualityReport(auth)

        // providerId is the only lookup handle DMR accepts on
        // GET /application/reports/:providerId — `id` resolves only against the
        // admin-only endpoint and `identifier` is a human-facing display code.
        if (!activeReport?.providerId) return null

        const report = await this.directorateOfEqualityService.getReport(
          auth,
          activeReport.providerId,
        )
        return { equalityReportContent: report.equalityReportContent ?? '' }
      },
    )
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

      // A curated translatedMessage means DMR doesn't recognize the company
      // (not yet onboarded) — getActiveEqualityReport already surfaces that
      // on this same prerequisites screen, so showing the generic error here
      // too would just be a second, uninformative alert for the same cause.
      // The download-template button simply won't render without base64.
      if (this.extractApiErrorTranslatedMessage(error)) {
        return {}
      }

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

  // Idempotent on providerId — reopening this step returns the same draft.
  async createEqualityDraft({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to create equality report draft',
      () =>
        this.directorateOfEqualityService.createDraft(auth, {
          type: ReportTypeEnum.EQUALITY,
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
      { surfaceApiErrorDetails: true },
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

        try {
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
        } catch (error) {
          // DMR returns 409 when the company already has a report in progress
          // with the reviewing body — worth its own message instead of the
          // generic defaultTemplateApiError text.
          if (this.extractFetchErrorDetails(error).status === 409) {
            throw new TemplateApiError(
              {
                title: coreErrorMessages.defaultTemplateApiError,
                summary: salaryReportMessages.errors.submitConflict,
              },
              409,
            )
          }
          throw error
        }
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
            // Answered as `yyyy-MM-dd`; EditOutlierGroupDto types it `Date`,
            // which is what clientConfig's `format: date` generates, so it is
            // converted rather than passed through. A `yyyy-MM-dd` string parses
            // as UTC midnight, so no local zone can shift the date on the way
            // out.
            //
            // A blank yields an Invalid Date, which `JSON.stringify` writes as
            // `null` — and the field is required, so DMR answers 400. That is
            // the intent: the review screen's submit is gated on
            // isOutlierGroupSubmittable, which requires this too, so a blank
            // here is a group that should never have reached submission, and
            // saying so beats inventing a date the applicant never committed to.
            remedyDate: new Date(g.remedyDate ?? ''),
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

  // Finalises the draft; only the pre-dataEntry answers need patching onto
  // it first — the report's narrative content was already pushed live via
  // the directorate-of-equality-application GraphQL resolver's
  // updateEqualityDraftContent mutation as the applicant uploaded it, not
  // read from application.answers here.
  async submitEqualityDraft({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const answers = this.parseAnswers(
      equalityReportDataSchema,
      application.answers,
      application.id,
    )
    const providerId = application.id
    const subsidiaryList = answers.subsidiaries?.list ?? []

    return this.withTemplateApiError(
      application.id,
      'Failed to submit equality report',
      async () => {
        await this.directorateOfEqualityService.updateDraft(auth, providerId, {
          companyAdminName: answers.chiefExecutive?.name ?? '',
          companyAdminTitle: answers.chiefExecutive?.jobTitle ?? '',
          companyAdminEmail: answers.chiefExecutive?.email ?? '',
          companyAdminGender: mapGender(answers.chiefExecutive?.gender),
          contactName: answers.contactPerson?.name ?? '',
          contactEmail: answers.contactPerson?.email ?? '',
          contactPhone: answers.contactPerson?.phone ?? '',
          averageEmployeeFemaleCount: toNumberOrZero(
            answers.employeeCount?.women,
          ),
          averageEmployeeMaleCount: toNumberOrZero(answers.employeeCount?.men),
          averageEmployeeNeutralCount: toNumberOrZero(
            answers.employeeCount?.nonBinary,
          ),
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
    const comment = await this.withTemplateApiError(
      application.id,
      'Failed to submit report comment',
      () =>
        this.directorateOfEqualityService.submitReportComment(
          auth,
          application.id,
          { body },
        ),
    )

    // Clearing the send buffer belongs here, not in the UI: once DMR has the
    // comment there is no way for the client to fail the cleanup without
    // reporting a false send error and leaving a re-sendable body persisted.
    // Best effort — the comment is already posted, so a failed clear must not
    // fail the action.
    try {
      const existingComment =
        getValueViaPath<Record<string, unknown>>(
          application.answers,
          'comment',
        ) ?? {}
      const answers = {
        ...application.answers,
        comment: { ...existingComment, newMessage: '' },
      }
      await this.applicationApiService.update(application.id, { answers })
      // The action runner hands the same application object to later actions
      // and returns it to the caller, so keep it in sync with the row.
      application.answers = answers
    } catch (error) {
      this.logger.warn(
        'Failed to clear submitted report comment from answers',
        {
          applicationId: application.id,
          context: LOGGING_CONTEXT,
          ...this.extractFetchErrorDetails(error),
        },
      )
    }

    return comment
  }
}
