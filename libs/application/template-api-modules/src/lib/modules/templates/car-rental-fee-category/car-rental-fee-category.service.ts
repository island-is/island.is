import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { Auth } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { RskRentalDayRateClient } from '@island.is/clients-rental-day-rate'
import { getValueViaPath } from '@island.is/application/core'
import { AttachmentS3Service } from '../../shared/services'

import {
  CarCategoryRecord,
  CarMap,
  RateCategory,
  UploadSelection,
  buildCurrentCarMap,
  getUploadFileType,
  is15DaysOrMoreFromDate,
  parseUploadFile,
} from '@island.is/application/templates/car-rental-fee-category'
import { TemplateApiError } from '@island.is/nest/problem'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class CarRentalFeeCategoryService extends BaseTemplateApiService {
  constructor(
    private readonly rentalDayRateClient: RskRentalDayRateClient,
    private readonly attachmentService: AttachmentS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_RENTAL_FEE_CATEGORY)
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  async getVehicleCarMap({
    auth,
  }: TemplateApiModuleActionProps): Promise<CarMap> {
    const api = this.rentalsApiWithAuth(auth)

    const [vehicles, rates] = await Promise.all([
      api
        .apiDayRateEntriesEntityIdEligibleVehiclesGet({
          entityId: auth.nationalId,
        })
        .catch((error) => {
          this.logger.error(
            'Error getting vehicles with mileage from Skatturinn',
            error,
          )
          throw error
        }),
      api
        .apiDayRateEntriesEntityIdGet({
          entityId: auth.nationalId,
        })
        .catch((error) => {
          this.logger.error(
            'Error getting current vehicles rate category from Skatturinn',
            error,
          )
          throw error
        }),
    ])

    return buildCurrentCarMap(vehicles, rates)
  }

  async postDataToSkatturinn({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const uploadSelection =
      getValueViaPath<UploadSelection>(
        application.answers,
        'singleOrMultiSelectionRadio',
      ) ?? UploadSelection.MULTI

    const rateToChangeTo = getValueViaPath<RateCategory>(
      application.answers,
      'categorySelectionRadio',
    )
    if (!rateToChangeTo) {
      throw new TemplateApiError(
        {
          title: 'Missing rate to change to',
          summary: 'No rate to change to found',
        },
        400,
      )
    }
    const currentCarData =
      getValueViaPath<CarMap>(
        application.externalData,
        'getVehicleCarMap.data',
      ) ?? {}

    let data: CarCategoryRecord[] = []

    if (uploadSelection === UploadSelection.SINGLE) {
      const vehicleLatestMilageRows =
        getValueViaPath<Array<{ permno: string; latestMilage: number }>>(
          application.answers,
          'vehicleLatestMilageRows',
        ) ?? []

      if (vehicleLatestMilageRows.length === 0) {
        throw new TemplateApiError(
          {
            title: 'Missing manual entries',
            summary: 'No manual vehicle mileage entries found',
          },
          400,
        )
      }

      const invalidRows: string[] = []
      const manualData = vehicleLatestMilageRows
        .map<CarCategoryRecord | null>((row) => {
          const permno = row.permno?.trim()
          const newMilage = Number(row.latestMilage)
          const currentCar = permno ? currentCarData[permno] : undefined

          if (
            !permno ||
            !currentCar ||
            Number.isNaN(newMilage) ||
            newMilage < 0
          ) {
            invalidRows.push(permno || '-')
            return null
          }

          if (currentCar.category === rateToChangeTo) {
            invalidRows.push(permno)
            return null
          }

          if (newMilage < currentCar.mileage) {
            invalidRows.push(permno)
            return null
          }

          if (rateToChangeTo === RateCategory.KMRATE) {
            const validFromDate = currentCar.activeDayRate?.validFrom
            if (validFromDate && !is15DaysOrMoreFromDate(validFromDate)) {
              invalidRows.push(permno)
              return null
            }
          }

          return {
            vehicleId: permno,
            oldMileage: currentCar.mileage,
            newMilage,
            rateCategory: rateToChangeTo as string,
          }
        })
        .filter((row): row is CarCategoryRecord => row !== null)

      data = manualData

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

      if (data.length === 0) {
        throw new TemplateApiError(
          { title: 'Invalid data', summary: 'Invalid data found' },
          400,
        )
      }
    } else {
      const [attachment] = await this.attachmentService.getFiles(application, [
        'carCategoryFile',
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
        rateToChangeTo,
        currentCarData,
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

      data = parsed.records
    }

    const now = new Date()
    const endOfToday = new Date(now.setHours(23, 59, 59, 999))
    const tomorrow = new Date(now.setHours(24, 0, 0, 0))

    try {
      if (rateToChangeTo === RateCategory.DAYRATE) {
        const requestBody = {
          entityId: auth.nationalId,
          dayRateRegistrationModel: {
            skraningaradili:
              application.applicant ?? application.applicantActors[0] ?? null,
            entries:
              data?.map((c) => {
                return {
                  permno: c.vehicleId,
                  mileage: c.newMilage,
                  validFrom: tomorrow,
                }
              }) ?? null,
          },
        }
        await this.rentalsApiWithAuth(
          auth,
        ).apiDayRateEntriesEntityIdRegisterPost({ ...requestBody })
        return true
      } else {
        const requestBody = {
          entityId: auth.nationalId,
          deregistrationModel: {
            afskraningaradili:
              application.applicant ?? application.applicantActors[0] ?? null,
            entries:
              data?.map((c) => {
                return {
                  permno: c.vehicleId,
                  mileage: c.newMilage,
                  validTo: endOfToday,
                }
              }) ?? null,
          },
        }
        await this.rentalsApiWithAuth(
          auth,
        ).apiDayRateEntriesEntityIdDeregisterPost({ ...requestBody })
        return true
      }
    } catch (error) {
      this.logger.error('Error posting data to skatturinn', error)

      if (error && typeof error === 'object' && 'status' in error) {
        if (error.status === 400) {
          const bodySummary = this.formatSkatturinnErrorBody(
            (error as { body?: unknown }).body,
          )

          throw new TemplateApiError(
            {
              title:
                (error as { title?: string; statusText?: string }).title ??
                (error as { statusText?: string }).statusText ??
                'Bad request',
              summary: bodySummary ?? 'Invalid input.',
            },
            error.status,
          )
        }
      }

      throw new TemplateApiError(
        {
          title: 'Request to skatturinn failed',
          summary:
            error.message ??
            error ??
            'Something went wrong when posting car data to skatturinn',
        },
        (error as { status?: number })?.status ?? 500,
      )
    }
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
