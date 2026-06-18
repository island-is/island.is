import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../../lib/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { getValueViaPath, coreErrorMessages } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { FetchError } from '@island.is/clients/middlewares'
import { prereq } from '@island.is/application/templates/vmst/confirm-job-search'

type Tablerow = {
  isUnsaved: boolean
  companyName: string
}[]

@Injectable()
export class ConfirmJobSearchService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.CONFIRM_JOB_SEARCH)
  }

  async completeApplication({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<boolean> {
    try {
      const appliedCompanies = (
        getValueViaPath<Tablerow>(application.answers, 'jobSearchItems', []) ||
        []
      )
        .filter((item) => !item.isUnsaved)
        .map((item) => item.companyName)

      await this.vmstUnemploymentClientService.submitJobSearchConfirmation(
        auth,
        { appliedCompanies },
      )

      return true
    } catch (e) {
      this.logger.error(
        '[VMST-Job-search-confirmation] - Error submitting job search confirmation',
      )
      throw e
    }
  }

  async checkEligibility({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    let result
    try {
      result =
        await this.vmstUnemploymentClientService.checkJobSearchConfirmationEligibility(
          auth,
        )
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        this.logger.warn(
          '[VMST-Job-search-confirmation] - No active application found (404)',
        )
        throw new TemplateApiError(
          {
            title: prereq.eligibilityErrorTitle,
            summary: prereq.noActiveApplicationFound,
          },
          404,
        )
      }

      this.logger.error(
        '[VMST-Job-search-confirmation] - Error checking eligibility',
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
          title: prereq.eligibilityErrorTitle,
          summary:
            (currentUserLocale === 'is' ? result.reason : result.reasonEN) ||
            '',
        },
        400,
      )
    }

    return result
  }
}
