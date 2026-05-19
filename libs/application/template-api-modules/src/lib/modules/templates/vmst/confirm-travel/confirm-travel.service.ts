import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  errorMsgs,
  DateInAnswers,
} from '@island.is/application/templates/vmst/confirm-travel'
import { FetchError } from '@island.is/clients/middlewares'

const OVERLAPPING_PERIOD = 'OVERLAPPING_PERIOD'

@Injectable()
export class ConfirmTravelService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.UNEMPLOYMENT_CONFIRM_TRAVEL)
  }
  async getEligibility({ auth }: TemplateApiModuleActionProps) {
    let result
    try {
      result =
        await this.vmstUnemploymentClientService.checkConfirmTravelEligibility(
          auth,
        )
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        this.logger.warn(
          '[VMST-Travel-confirmation] - No active application found (404)',
        )
        throw new TemplateApiError(
          {
            title: errorMsgs.cannotApplyErrorTitle,
            summary: errorMsgs.cannotApplyErrorSummary,
          },
          404,
        )
      }

      this.logger.error(
        '[VMST-Travel-confirmation] - Error checking eligibility',
        e,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.failedDataProvider,
        },
        500,
      )
    }

    if (!result.isEligible) {
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
          summary: errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }

    return result
  }

  async submitApplication({ auth, application }: TemplateApiModuleActionProps) {
    try {
      const travelPeriod = getValueViaPath<DateInAnswers>(
        application.answers,
        'date',
        undefined,
      )

      await this.vmstUnemploymentClientService.submitTravelConfirmation(auth, {
        dateFrom: travelPeriod ? new Date(travelPeriod.from) : undefined,
        dateTo: travelPeriod ? new Date(travelPeriod.to) : undefined,
      })

      return true
    } catch (e) {
      this.logger.error(
        '[VMST-Travel-confirmation] - Error submitting travel confirmation',
      )

      const body =
        e instanceof FetchError
          ? (e.body as { message?: string; code?: string })
          : undefined
      const summary =
        body?.code === OVERLAPPING_PERIOD && body.message ? body.message : ''

      throw new TemplateApiError(
        {
          title: errorMsgs.submitError,
          summary,
        },
        500,
      )
    }
  }
}
