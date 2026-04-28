import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  GaldurExternalDomainRequestsApplicantCreateForeignStayRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
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

@Injectable()
export class ConfirmTravelService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.UNEMPLOYMENT_CONFIRM_TRAVEL)
  }
  async getEligability({ auth }: TemplateApiModuleActionProps) {
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
          summary: result.reason ?? '',
        },
        400,
      )
    }

    return result
  }

  async submitApplication({ auth, application }: TemplateApiModuleActionProps) {
    try {
      const travelPeriods: Array<GaldurExternalDomainRequestsApplicantCreateForeignStayRequest> =
        (
          getValueViaPath<Array<DateInAnswers>>(
            application.answers,
            'dates',
            [],
          ) || []
        ).map((item) => ({
          dateFrom: item.from,
          dateTo: item.to,
        }))

      await this.vmstUnemploymentClientService.submitTravelConfirmation(
        auth,
        travelPeriods[0], //TODO fix when decided if list or single item
      )

      return true
    } catch (e) {
      this.logger.error(
        '[VMST-Travel-confirmation] - Error submitting travel confirmation',
      )
      throw e
    }
  }
}
