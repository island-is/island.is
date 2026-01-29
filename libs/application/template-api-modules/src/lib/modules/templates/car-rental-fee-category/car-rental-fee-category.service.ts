import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { RskRentalDayRateClient } from '@island.is/clients-rental-day-rate'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import { getValueViaPath } from '@island.is/application/core'
import { AttachmentS3Service } from '../../shared/services'

import {
  CurrentVehicleWithMilage,
  RateCategory,
  buildCurrentCarMap,
  getUploadFileType,
  parseUploadFile,
} from '@island.is/application/templates/car-rental-fee-category'
import { TemplateApiError } from '@island.is/nest/problem'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class CarRentalFeeCategoryService extends BaseTemplateApiService {
  constructor(
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly rentalDayRateClient: RskRentalDayRateClient,
    private readonly attachmentService: AttachmentS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_RENTAL_FEE_CATEGORY)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  async getCurrentVehicles({
    auth,
  }: TemplateApiModuleActionProps): Promise<CurrentVehicleWithMilage[]> {
    try {
      const [carsWithMilage, carsWithStatuses] = await Promise.all([
        this.vehiclesApiWithAuth(auth).currentvehicleswithmileageandinspGet({
          showOwned: true,
          showCoowned: true,
          showOperated: true,
          page: 0,
          pageSize: 100000,
          onlyMileageRequiredVehicles: false,
          onlyMileageRegisterableVehicles: false,
        }),
        this.vehiclesApiWithAuth(auth).currentVehiclesGet({
          persidNo: auth.nationalId,
          showOwned: true,
          showCoowned: true,
          showOperated: true,
        }),
      ])

      const carIsOutOfUseDict = carsWithStatuses.reduce((acc, vehicle) => {
        if (vehicle.permno) {
          acc[vehicle.permno] = vehicle.outOfUse ?? false
        }
        return acc
      }, {} as Record<string, boolean>)

      return (
        carsWithMilage.data
          ?.filter(
            (vehicle) =>
              vehicle.permno &&
              typeof vehicle.latestMileage === 'number' &&
              vehicle.latestMileage >= 0 &&
              vehicle.permno in carIsOutOfUseDict &&
              !carIsOutOfUseDict[vehicle.permno],
          )
          .map((vehicle) => ({
            permno: vehicle.permno ?? null,
            milage: vehicle.latestMileage ?? null,
          })) || []
      )
    } catch (error) {
      this.logger.error(
        'Error getting vehicles with milage and statuses',
        error,
      )
      throw error
    }
  }

  async getCurrentVehiclesRateCategory({
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<EntryModel>> {
    try {
      const resp = await this.rentalsApiWithAuth(
        auth,
      ).apiDayRateEntriesEntityIdGet({
        entityId: auth.nationalId,
      })
      return resp
    } catch (error) {
      this.logger.error('Error getting current vehicles rate category', error)
      throw error
    }
  }

  async postDataToSkatturinn({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    const [attachment] = await this.attachmentService.getFiles(application, [
      'carCategoryFile',
    ])
    if (!attachment?.fileContent) {
      throw new TemplateApiError(
        { title: 'Missing file', summary: 'No uploaded file found' },
        400,
      )
    }

    const rateToChangeTo = getValueViaPath<RateCategory>(
      application.answers,
      'categorySelectionRadio',
    )
    if (!rateToChangeTo) {
      throw new TemplateApiError(
        { title: 'Missing rate to change to', summary: 'No rate to change to found' },
        400,
      )
    }
    const currentVehicles = getValueViaPath<CurrentVehicleWithMilage[]>(
      application.externalData,
      'getCurrentVehicles.data',
    )

    const currentRates = getValueViaPath<EntryModel[]>(
      application.externalData,
      'getCurrentVehiclesRateCategory.data',
    )

    const currentCarData = buildCurrentCarMap(currentVehicles, currentRates)

    const fileType = getUploadFileType(attachment.fileName ?? '')
    if (!fileType) {
      throw new TemplateApiError(
        { title: 'Invalid file type', summary: 'Only .csv or .xlsx are supported' },
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
        { title: 'Invalid data', summary: errorSummary || 'Invalid data found' },
        400,
      )
    }

    const data = parsed.records

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
    if (!body || typeof body !== 'object') return undefined

    const messages = Object.entries(body as Record<string, unknown>)
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
