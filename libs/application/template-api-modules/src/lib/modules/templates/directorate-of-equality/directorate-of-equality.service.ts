import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  DirectorateOfEqualityClientService,
  EqualityCoverageSourceEnum,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'
import { TemplateApiError } from '@island.is/nest/problem'
import { ApplicationTypes } from '@island.is/application/types'
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
import {
  mapGender,
  mapSubsidiaries,
  toNumberOrZero,
} from './directorate-of-equality.utils'

// Page size for walking listDraftEmployees to completion on salary-analysis screens.
const DRAFT_EMPLOYEE_PAGE_SIZE = 100

const LOGGING_CONTEXT = 'DirectorateOfEqualityService'

/**
 * What meets the company's equality obligation at submit time.
 *
 * Only one of the two kinds has an id. An approved equality report filed here
 * is named by `equalityReportId`; an unexpired certificate from
 * Jafnrettisstofa's retired register has no report row behind it, so the field
 * is left off and DMR resolves the same certificate server-side. Either way the
 * company is covered — `covered: false` is the only answer that blocks.
 */
type EqualityCoverage =
  | { covered: true; equalityReportId?: string }
  | { covered: false; equalityReportId?: undefined }

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
  ):
    | { details?: unknown; translatedMessage?: unknown; name?: unknown }
    | undefined {
    if (!(error instanceof FetchError)) return undefined
    return error.body as
      | { details?: unknown; translatedMessage?: unknown; name?: unknown }
      | undefined
  }

  // "DMR has no such record" — the company, the report, or both. Matched on
  // ApiErrorDto.name as well as the status because DMR does not use 404
  // consistently for it: GET /application/company declares only 400/401/403/500,
  // yet answers an unknown company with the NotFound name and a curated
  // "Fyrirtækið fannst ekki" message.
  private isNotFoundApiError(error: unknown): boolean {
    if (this.extractFetchErrorDetails(error).status === 404) return true
    return this.getApiErrorBody(error)?.name === 'NotFound'
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
      // A company DMR has not onboarded yet has no size on record, and that
      // is not a reason to stop the applicant — DMR provisions it when the
      // draft is opened. UNKNOWN renders as an empty size field.
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
      // Never fatal to the prerequisites screen: for a company DMR has not
      // onboarded yet the catalog simply comes up empty, and DMR provisions
      // the company when the draft is opened.
      this.logger.error('Failed to get sub-criterion catalog, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...this.extractFetchErrorDetails(error),
      })
      return { entries: [], generalScale: [] }
    }
  }

  // Shared by the salary-report and equality-report prerequisites screens.
  // A company DMR has never seen is not an error here: it is the first-time
  // filer the equality-report application exists for, and DMR auto-provisions
  // the company on the first POST /application/reports/draft. So an unknown
  // company reads as "no approved report" rather than blocking the screen —
  // the same silent fallback getDoeCompany, getSubCriterionCatalog and
  // getBlankExcelTemplate already make.
  async getActiveEqualityReport({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    try {
      const report =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)
      // The flag means "the equality obligation is met", which a legacy
      // certificate does just as well as a report filed here. `source` rides
      // along for the screens that need to tell the two apart — a legacy
      // certificate has no report row, so no content and no providerId.
      return { hasActiveEqualityReport: true, ...report }
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error('Failed to get active equality report, falling back', {
        applicationId: application.id,
        context: LOGGING_CONTEXT,
        ...errorDetails,
      })

      // A definitive negative, not a failure: either the company holds no
      // approved plan or DMR has no company record at all. Both mean the same
      // thing to the applicant, and the salary report's NOT_ALLOWED screen
      // already says so and links to the equality-report application.
      if (this.isNotFoundApiError(error)) {
        return { hasActiveEqualityReport: false }
      }

      // Past this point DMR did not answer at all. The two templates want
      // opposite things from that silence, so the fallback is per template.
      //
      // Equality report: the flag only decides whether the optional "previous
      // plan" step renders, so an outage must not stand between an applicant
      // and their jafnréttisáætlun.
      if (application.typeId === ApplicationTypes.EQUALITY_REPORT) {
        return { hasActiveEqualityReport: false }
      }

      // Salary report: the flag is the eligibility guard out of PREREQUISITES.
      // Answering false would send a company that does hold an approved plan
      // to the rejection screen, so a genuine outage has to surface instead.
      const translatedMessage = this.extractApiErrorTranslatedMessage(error)
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: translatedMessage ?? coreErrorMessages.failedDataProvider,
        },
        errorDetails.status ?? 500,
      )
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

  /**
   * The previous plan's PDF, when that plan was uploaded rather than typed.
   *
   * On demand only: the applicant presses "view the earlier áætlun" and the
   * bytes are fetched then. Returned as base64 for the same reason
   * `getEqualityReportTemplateDocx` does — the provider channel carries JSON,
   * and the field turns it back into a Blob to hand the browser.
   */
  async getPreviousEqualityReportPdf({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return this.withTemplateApiError(
      application.id,
      'Failed to get previous equality report PDF',
      async () => {
        const activeReport =
          await this.directorateOfEqualityService.getActiveEqualityReport(auth)

        if (!activeReport?.providerId) return null

        const blob =
          await this.directorateOfEqualityService.getEqualityContentPdf(
            auth,
            activeReport.providerId,
          )
        const arrayBuffer = await blob.arrayBuffer()

        return { base64: Buffer.from(arrayBuffer).toString('base64') }
      },
    )
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

        /*
         * `contentType` travels with the content because the two are not
         * separable: DMR returns `equalityReportContent: null` for a PDF-backed
         * plan (the bytes are megabytes of base64 and would ride along on every
         * read), so without the type an uploaded plan is indistinguishable from
         * no plan at all — and the screen would tell the applicant there was no
         * earlier áætlun when there was one.
         *
         * The bytes themselves are fetched on demand by
         * `getPreviousEqualityReportPdf`, not here.
         */
        return {
          equalityReportContent: report.equalityReportContent ?? '',
          contentType: report.equalityReportContentType,
          contentFilename: report.equalityReportContentFilename ?? null,
          providerId: activeReport.providerId,
        }
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
      // (not yet onboarded) rather than that the service broke — no reason to
      // stop the applicant on the prerequisites screen. The download-template
      // button simply won't render without base64.
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

  // The coverage captured at PREREQUISITES goes stale if the equality report is
  // re-approved while this draft sits open, so re-resolve it live here.
  private async resolveEqualityCoverage(
    auth: TemplateApiModuleActionProps['auth'],
    application: TemplateApiModuleActionProps['application'],
  ): Promise<EqualityCoverage> {
    const persisted = getValueViaPath<{
      source?: string
      id?: string | null
    }>(application.externalData, 'activeEqualityReport.data')

    try {
      const activeReport =
        await this.directorateOfEqualityService.getActiveEqualityReport(auth)

      // Branch on `source`, never on a null id: legacy coverage answers 200
      // with `id`, `identifier`, `providerId` and `approvedAt` all null, and
      // reading that as "no plan" would reject a company that holds a valid
      // one. There is no id to send — DMR resolves the certificate itself.
      if (activeReport?.source === EqualityCoverageSourceEnum.LEGACY) {
        return { covered: true }
      }

      const equalityReportId = activeReport?.id ?? persisted?.id ?? undefined
      return equalityReportId
        ? { covered: true, equalityReportId }
        : { covered: false }
    } catch (error) {
      const errorDetails = this.extractFetchErrorDetails(error)
      this.logger.error(
        'Failed to resolve active equality report before salary submit',
        {
          applicationId: application.id,
          context: LOGGING_CONTEXT,
          ...errorDetails,
        },
      )

      // 404 is DMR's definitive "nothing covers this company" — the persisted
      // coverage is known-stale, so don't fall back to it.
      if (errorDetails.status === 404) return { covered: false }

      // DMR did not answer. The coverage read at PREREQUISITES is the best
      // guess left, and for a legacy certificate that is a source with no id
      // rather than an id — submitting without one lets DMR resolve it.
      if (persisted?.source === EqualityCoverageSourceEnum.LEGACY) {
        return { covered: true }
      }

      return persisted?.id
        ? { covered: true, equalityReportId: persisted.id }
        : { covered: false }
    }
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

    const equalityCoverage = await this.resolveEqualityCoverage(
      auth,
      application,
    )
    if (!equalityCoverage.covered) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: salaryReportMessages.errors.missingEqualityReport,
        },
        400,
      )
    }

    const providerId = application.id
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
          contactTitle: answers.contactPerson?.jobTitle ?? '',
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
              subsidiaries: mapSubsidiaries(answers.subsidiaries),
              // Omitted entirely for legacy coverage — see resolveEqualityCoverage.
              equalityReportId: equalityCoverage.equalityReportId,
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
            // Passed through as the `yyyy-MM-dd` DatePickerController stored,
            // which is the date-only form DMR validates for — same as the draft
            // sync sends in buildOutlierSyncCommands. The cast is because
            // clientConfig's `format: date` generates the field as `Date`, but
            // the transformers plugin only converts responses: a `Date` here
            // would be serialised as a full ISO instant and rejected.
            //
            // A blank sends `null` on a required field, so DMR answers 400.
            // That is the intent: the review screen's submit is gated on
            // isOutlierGroupSubmittable, which requires this too, so a blank
            // here is a group that should never have reached submission, and
            // saying so beats inventing a date the applicant never committed to.
            remedyDate: (g.remedyDate || null) as unknown as Date,
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
          contactTitle: answers.contactPerson?.jobTitle ?? '',
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
            subsidiaries: mapSubsidiaries(answers.subsidiaries),
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
