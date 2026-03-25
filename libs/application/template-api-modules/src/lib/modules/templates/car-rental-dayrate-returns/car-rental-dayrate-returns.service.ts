import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { Auth } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  RskRentalDayRateClient,
  RskRentalDaysClient,
} from '@island.is/clients-rental-day-rate'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  buildDayRateEntryMap,
  CarUsageRecord,
  DayRateRecord,
  getMonthTotalDayRateDays,
  getUploadFileType,
  parseUploadFile,
  UploadSelection,
} from '@island.is/application/templates/car-rental-dayrate-returns'
import { TemplateApiError } from '@island.is/nest/problem'
import { AttachmentS3Service } from '../../shared/services'
import { getValueViaPath } from '@island.is/application/core'

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
    try {
      const now = new Date()
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthIndex = lastMonthDate.getMonth()

      // Log the request url to the RSK day-rate API to debug
      const resp = await this.rentalsApiWithAuth(auth)
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
        .apiDayRateEntriesEntityIdGet({
          entityId: auth.nationalId,
        })

      const dayRateEntryMap = buildDayRateEntryMap(resp)

      const entries: Array<DayRateRecord> = Object.entries(dayRateEntryMap)
        .map(([permno, data]) => {
          const result = getMonthTotalDayRateDays({
            dayRateEntries: data,
            targetYear: lastMonthDate.getFullYear(),
            targetMonthIndex: lastMonthIndex,
          })

          if (!result) return null
          const { totalDays, entryId } = result

          if (totalDays === 0 || !entryId) return null

          return {
            permno,
            prevPeriodTotalDays: totalDays,
            dayRateEntryId: entryId,
          }
        })
        .filter((entry): entry is DayRateRecord => entry !== null)

      this.logger.info('RSK day-rate response count', {
        responseCount: resp.length,
      })
      this.logger.info('Computed previous-period entries', {
        entryCount: entries.length,
      })

      return entries
    } catch (error) {
      this.logger.error('Error getting previous period day rate entries', error)
      throw error
    }
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

      const entries = records.map((record) => {
        const dayRateEntryId = dayRateRecordsByPermno.get(
          record.vehicleId,
        )?.dayRateEntryId

        if (!dayRateEntryId) {
          throw new TemplateApiError(
            {
              title: 'Missing day rate entry',
              summary: `No dayRateEntryId for vehicle ${record.vehicleId}`,
            },
            400,
          )
        }

        return {
          permno: record.vehicleId,
          numberOfDays: record.prevPeriodUsage,
          dayRateEntryId,
          month: lastMonthIndex + 1,
          year: lastMonthDate.getFullYear(),
        }
      })

      await this.rentalDaysApiWithAuth(auth).apiRentalDaysEntityIdPost({
        entityId: auth.nationalId,
        rentalDayRegistrationModel: {
          entries,
        },
      })

      return true
    } catch (error) {
      this.logger.error('Error posting data to skatturinn', error)

      const isSkatturinnError = (error: unknown): error is SkatturinnError =>
        typeof error === 'object' && error !== null && 'status' in error

      if (isSkatturinnError(error) && error.status === 400) {
        const bodySummary = this.formatSkatturinnErrorBody(error.body)

        throw new TemplateApiError(
          {
            title: error.title ?? error.statusText ?? 'Bad request',
            summary: bodySummary ?? 'Invalid input.',
          },
          error.status,
        )
      }

      throw new TemplateApiError(
        {
          title: 'Request to skatturinn failed',
          summary: 'Something went wrong when posting car data to skatturinn',
        },
        isSkatturinnError(error) ? error.status ?? 500 : 500,
      )
    }
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
          dayRateEntryId: number
        }>
      >(application.answers, 'vehicleDayRateUsageRows') ?? []

    if (tableRows.length === 0) {
      throw new TemplateApiError(
        {
          title: 'Missing manual entries',
          summary: 'No vehicle day rate usage entries found',
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
          title: 'Invalid data',
          summary: errorSummary || 'Invalid data found',
        },
        400,
      )
    }

    if (records.length === 0) {
      throw new TemplateApiError(
        { title: 'Invalid data', summary: 'No valid entries found' },
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
        { title: 'Missing file', summary: 'No uploaded file found' },
        400,
      )
    }

    const fileType = getUploadFileType(attachment.fileName ?? '')
    if (!fileType) {
      throw new TemplateApiError(
        {
          title: 'Invalid file type',
          summary: 'Only .csv or .xlsx are supported',
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
          { title: 'Invalid data', summary: 'Invalid data found' },
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
          title: 'Invalid data',
          summary: errorSummary || 'Invalid data found',
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
