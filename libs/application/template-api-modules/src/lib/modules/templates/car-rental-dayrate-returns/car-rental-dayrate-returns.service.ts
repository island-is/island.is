import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { Auth } from '@island.is/auth-nest-tools'
import { TemplateApiModuleActionProps } from '../../../types'
import { DayRateEntry, RskRentalDayRateClient } from '@island.is/clients-rental-day-rate'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CarCategoryRecord, RateCategory } from '@island.is/application/templates/car-rental-fee-category'

@Injectable()
export class CarRentalDayrateReturnsService extends BaseTemplateApiService {
  constructor(
    private readonly rentalDayRateClient: RskRentalDayRateClient,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.CAR_RENTAL_DAYRATE_RETURNS)
  }

  private rentalsApiWithAuth(auth: Auth) {
    return this.rentalDayRateClient.defaultApiWithAuth(auth)
  }

  async getPreviousPeriodDayRateReturns({
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<DayRateEntry>> {
    try {
      const resp = await this.rentalsApiWithAuth(
        auth,
      ).apiDayRateEntriesEntityIdGet({
        entityId: auth.nationalId,
        //period: new Date(),
      })
      console.log(resp)
      return []
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
      return true

      // There is no api to send how many days a car was used in the previous period
      // const resp = await this.rentalsApiWithAuth(
      //   auth,
      // ).api({
      //   entityId: auth.nationalId,
      //   period: new Date(),
      // })
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
          summary: 'Something went wrong when posting car data to skatturinn',
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

export interface CurrentVehicleWithMilage {
  permno: string | null
  make: string | null
  milage: number | null
}
