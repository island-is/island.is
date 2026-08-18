import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { Auth, User } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  InsertRentalDaysModel,
  RentalDaysEntry,
  RskRentalDayRateClient,
  RskRentalDaysClient,
} from '@island.is/clients-rental-day-rate'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CarUsageRecord,
  DayRateRecord,
  getUploadFileType,
  messages,
  parseUploadFile,
  UploadSelection,
} from '@island.is/application/templates/car-rental-dayrate-returns'
import { TemplateApiError } from '@island.is/nest/problem'
import { AttachmentS3Service } from '../../shared/services'
import { getValueViaPath } from '@island.is/application/core'

const toPeriod = (year: number, monthIndex: number): string =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}`

/**
 * Rental days Skatturinn has already registered for a period, summed per vehicle.
 * A vehicle can appear more than once when its days were reported in batches.
 */
const sumRentalDaysByPermno = (
  entries: Array<RentalDaysEntry>,
): Map<string, number> => {
  const totals = new Map<string, number>()

  for (const entry of entries) {
    if (!entry.fastnr) continue
    totals.set(
      entry.fastnr,
      (totals.get(entry.fastnr) ?? 0) + (entry.fjoldiDaga ?? 0),
    )
  }

  return totals
}

@Injectable()
export class CarRentalDayrateReturnsService extends BaseTemplateApiService {
  constructor(
    private readonly rentalDayRateClient: RskRentalDayRateClient,
    private readonly rentalDaysClient: RskRentalDaysClient,
    private readonly attachmentService: AttachmentS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_RENTAL_DAYRATE_RETURNS)
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  private rentalDaysApiWithAuth(auth: Auth) {
    return this.rentalDaysClient.rentalDaysApiWithAuth(auth)
  }

  async getPreviousPeriodDayRateReturns({
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<DayRateRecord>> {
    const now = new Date()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const targetYear = lastMonthDate.getFullYear()
    const targetMonthIndex = lastMonthDate.getMonth()
    const period = toPeriod(targetYear, targetMonthIndex)

    const targetFromUtc = new Date(Date.UTC(targetYear, targetMonthIndex, 1))
    const targetToUtc = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0))

    const context = { entityId: auth.nationalId, period }

    const [dayRateEntries, reportedRentalDays] = await Promise.all([
      this.rentalsApiWithAuth(auth)
        .withPreMiddleware(async ({ url, init }) => {
          const headers = init?.headers
            ? Object.fromEntries(new Headers(init.headers).entries())
            : undefined

          const reqData = {
            url,
            method: init?.method,
            headers: headers
              ? {
                  ...headers,
                  authorization: headers.authorization
                    ? '[REDACTED]'
                    : undefined,
                  cookie: headers.cookie ? '[REDACTED]' : undefined,
                }
              : undefined,
          }
          this.logger.info('RSK day-rate request', reqData)
        })
        .apiDayRateEntriesEntityIdPeriodsPeriodGet({
          entityId: auth.nationalId,
          period,
        })
        .catch((error) => {
          this.logger.error(
            'Error getting previous period day rate entries from Skatturinn',
            { ...context, endpoint: 'dayRateEntriesPeriodsGet', error },
          )
          throw error
        }),
      this.rentalDaysApiWithAuth(auth)
        .apiRentalDaysEntityIdPeriodsPeriodGet({
          entityId: auth.nationalId,
          period,
        })
        .catch((error) => {
          this.logger.error(
            'Error getting already reported rental days from Skatturinn',
            { ...context, endpoint: 'rentalDaysPeriodsGet', error },
          )
          throw error
        }),
    ])

    const reportedDaysByPermno = sumRentalDaysByPermno(reportedRentalDays)

    return dayRateEntries
      .map<DayRateRecord | null>((entry) => {
        if (!entry.fastnr || !entry.id) return null

        const entryValidFrom = entry.gildirFra
          ? new Date(entry.gildirFra)
          : targetFromUtc
        const entryValidTo = entry.gildirTil
          ? new Date(entry.gildirTil)
          : targetToUtc

        const start =
          entryValidFrom > targetFromUtc ? entryValidFrom : targetFromUtc
        const end = entryValidTo < targetToUtc ? entryValidTo : targetToUtc

        if (end < start) return null

        const totalDays =
          Math.floor((end.getTime() - start.getTime()) / 86400000) + 1

        if (totalDays <= 0) return null

        return {
          permno: entry.fastnr,
          prevPeriodTotalDays: totalDays,
          dayRateEntryId: entry.id,
          // Kept in the list rather than filtered out so the applicant can see
          // the vehicle and why it needs nothing from them.
          alreadyReportedDays: reportedDaysByPermno.get(entry.fastnr),
        }
      })
      .filter((entry): entry is DayRateRecord => entry !== null)
  }

  async postDataToSkatturinn({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    try {
      const uploadSelection =
        getValueViaPath<UploadSelection>(
          application.answers,
          'singleOrMultiSelectionRadio',
        ) ?? UploadSelection.MULTI

      const dayRateRecords =
        getValueViaPath<Array<DayRateRecord>>(
          application.externalData,
          'getPreviousPeriodDayRateReturns.data',
        ) ?? []

      const dayRateRecordsByPermno = new Map<string, DayRateRecord>(
        dayRateRecords.map((d) => [d.permno, d]),
      )

      const now = new Date()
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthIndex = lastMonthDate.getMonth()

      let records: CarUsageRecord[] = []

      if (uploadSelection === UploadSelection.SINGLE) {
        records = this.getRecordsFromTableAnswers(
          application,
          dayRateRecordsByPermno,
        )
      } else {
        records = await this.getRecordsFromFileUpload(
          application,
          dayRateRecordsByPermno,
        )
      }

      // dayRateEntryId is optional for Skatturinn - when we cannot resolve it
      // from the (cached) external data we let them pick the active entry
      // rather than failing an otherwise valid submission.
      const entries: Array<InsertRentalDaysModel> = records.map((record) => ({
        permno: record.vehicleId,
        numberOfDays: record.prevPeriodUsage,
        dayRateEntryId: dayRateRecordsByPermno.get(record.vehicleId)
          ?.dayRateEntryId,
      }))

      // External data is captured back at the prerequisite step, so re-check
      // with Skatturinn that nothing landed for this period in the meantime.
      await this.assertNotAlreadyReported(
        auth,
        toPeriod(lastMonthDate.getFullYear(), lastMonthIndex),
        entries,
      )

      await this.rentalDaysApiWithAuth(auth).apiRentalDaysEntityIdPost({
        entityId: auth.nationalId,
        rentalDayRegistrationModel: {
          year: lastMonthDate.getFullYear(),
          month: lastMonthIndex + 1,
          entries,
        },
      })

      return true
    } catch (error) {
      // Validation errors raised above are already user-facing. ProblemError has
      // no top level `status`, so without this they fall through to the generic
      // rewrap below and the applicant loses the actual reason.
      if (error instanceof TemplateApiError) {
        throw error
      }

      this.logger.error('Error posting data to skatturinn', error)

      const isSkatturinnError = (error: unknown): error is SkatturinnError =>
        typeof error === 'object' && error !== null && 'status' in error

      if (isSkatturinnError(error) && error.status === 400) {
        const bodySummary = this.formatSkatturinnErrorBody(error.body)

        throw new TemplateApiError(
          {
            title:
              error.title ??
              error.statusText ??
              messages.serviceErrors.badRequest.title,
            summary: bodySummary ?? messages.serviceErrors.badRequest.summary,
          },
          error.status,
        )
      }

      throw new TemplateApiError(
        {
          title: messages.serviceErrors.requestToSkatturinnFailed.title,
          summary: messages.serviceErrors.requestToSkatturinnFailed.summary,
        },
        isSkatturinnError(error) ? error.status ?? 500 : 500,
      )
    }
  }

  private async assertNotAlreadyReported(
    auth: User,
    period: string,
    entries: Array<InsertRentalDaysModel>,
  ): Promise<void> {
    const reportedDaysByPermno = sumRentalDaysByPermno(
      await this.rentalDaysApiWithAuth(
        auth,
      ).apiRentalDaysEntityIdPeriodsPeriodGet({
        entityId: auth.nationalId,
        period,
      }),
    )

    if (reportedDaysByPermno.size === 0) return

    const duplicates = [
      ...new Set(
        entries
          .map((entry) => entry.permno)
          .filter(
            (permno): permno is string =>
              !!permno && reportedDaysByPermno.has(permno),
          ),
      ),
    ]

    if (duplicates.length === 0) return

    throw new TemplateApiError(
      {
        title: messages.serviceErrors.alreadyReported.title,
        summary: {
          ...messages.serviceErrors.alreadyReported.summary,
          values: {
            period,
            vehicles: duplicates.join(', '),
          },
        },
      },
      400,
    )
  }

  private getRecordsFromTableAnswers(
    application: TemplateApiModuleActionProps['application'],
    dayRateRecordsByPermno: Map<string, DayRateRecord>,
  ): CarUsageRecord[] {
    const tableRows =
      getValueViaPath<
        Array<{
          permno: string
          prevPeriodUsage: number
          dayRateEntryId?: number
        }>
      >(application.answers, 'vehicleDayRateUsageRows') ?? []

    if (tableRows.length === 0) {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.missingManualEntries.title,
          summary: messages.serviceErrors.missingManualEntries.summary,
        },
        400,
      )
    }

    const invalidRows: string[] = []
    const records = tableRows
      .map<CarUsageRecord | null>((row) => {
        const permno = row.permno?.trim()
        const usage = Number(row.prevPeriodUsage)
        const dayRateRecord = permno
          ? dayRateRecordsByPermno.get(permno)
          : undefined

        if (!permno || !dayRateRecord || Number.isNaN(usage) || usage < 0) {
          invalidRows.push(permno || '-')
          return null
        }

        if (dayRateRecord.alreadyReportedDays !== undefined) {
          invalidRows.push(permno)
          return null
        }

        if (usage > dayRateRecord.prevPeriodTotalDays) {
          invalidRows.push(permno)
          return null
        }

        return {
          vehicleId: permno,
          prevPeriodTotalDays: dayRateRecord.prevPeriodTotalDays,
          prevPeriodUsage: usage,
        }
      })
      .filter((row): row is CarUsageRecord => row !== null)

    if (invalidRows.length > 0) {
      const uniqueInvalidRows = [...new Set(invalidRows)]
      const errorSummary = uniqueInvalidRows
        .map((permno) => `${permno}: Invalid or ineligible row`)
        .join('\n')

      throw new TemplateApiError(
        {
          title: messages.serviceErrors.invalidData.title,
          summary: errorSummary
            ? {
                ...messages.serviceErrors.invalidData.summaryWithDetails,
                values: {
                  details: errorSummary,
                },
              }
            : messages.serviceErrors.invalidData.summary,
        },
        400,
      )
    }

    if (records.length === 0) {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.noValidEntriesFound.title,
          summary: messages.serviceErrors.noValidEntriesFound.summary,
        },
        400,
      )
    }

    return records
  }

  private async getRecordsFromFileUpload(
    application: TemplateApiModuleActionProps['application'],
    dayRateRecordsByPermno: Map<string, DayRateRecord>,
  ): Promise<CarUsageRecord[]> {
    const [attachment] = await this.attachmentService.getFiles(application, [
      'carDayRateUsageFile',
    ])
    if (!attachment?.fileContent) {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.missingFile.title,
          summary: messages.serviceErrors.missingFile.summary,
        },
        400,
      )
    }

    const fileType = getUploadFileType(attachment.fileName ?? '')
    if (!fileType) {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.invalidFileType.title,
          summary: messages.serviceErrors.invalidFileType.summary,
        },
        400,
      )
    }

    const bytes = Buffer.from(attachment.fileContent, 'base64')
    const parsed = await parseUploadFile(
      bytes,
      fileType,
      dayRateRecordsByPermno,
    )

    if (!parsed.ok) {
      if (parsed.reason === 'no-data') {
        throw new TemplateApiError(
          {
            title: messages.serviceErrors.invalidData.title,
            summary: messages.serviceErrors.invalidData.summary,
          },
          400,
        )
      }

      const errorSummary = parsed.errors
        .map((e) => {
          const msg =
            typeof e.message === 'string'
              ? e.message
              : e.message.defaultMessage ?? e.message.id
          return `${e.carNr}: ${msg}`
        })
        .filter((m) => m.length > 0)
        .join('\n')

      throw new TemplateApiError(
        {
          title: messages.serviceErrors.invalidData.title,
          summary: errorSummary
            ? {
                ...messages.serviceErrors.invalidData.summaryWithDetails,
                values: {
                  details: errorSummary,
                },
              }
            : messages.serviceErrors.invalidData.summary,
        },
        400,
      )
    }

    return parsed.records
  }

  private formatSkatturinnErrorBody(body: unknown): string | undefined {
    if (!body) return undefined

    let parsed: Record<string, unknown>

    if (typeof body === 'object') {
      parsed = body as Record<string, unknown>
    } else if (typeof body === 'string') {
      try {
        const json = JSON.parse(body)
        if (!json || typeof json !== 'object') return undefined
        parsed = json as Record<string, unknown>
      } catch {
        return undefined
      }
    } else {
      return undefined
    }

    const messages = Object.entries(parsed)
      .flatMap(([field, value]) => {
        if (Array.isArray(value)) {
          return value
            .filter((m): m is string => typeof m === 'string')
            .map((m) => `${field}: ${m}`)
        }
        if (typeof value === 'string') {
          return [`${field}: ${value}`]
        }
        return []
      })
      .filter((m) => m.length > 0)

    return messages.length > 0 ? messages.join('\n') : undefined
  }
}

type SkatturinnError = {
  status?: number
  title?: string
  statusText?: string
  body?: unknown
}
