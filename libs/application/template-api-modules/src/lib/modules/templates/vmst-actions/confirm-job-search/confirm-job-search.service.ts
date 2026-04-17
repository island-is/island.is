import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../../lib/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'

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
      const { applicantId } =
        await this.vmstUnemploymentClientService.resolveApplicant(auth)

      if (!applicantId) {
        this.logger.error(
          '[VMST-Job-search-confirmation] - Faile or missing resolve of applicantId',
        )
        throw new Error()
      }

      const appliedCompanies = (
        getValueViaPath<Tablerow>(application.answers, 'jobSearchItems', []) ||
        []
      )
        .filter((item) => !item.isUnsaved)
        .map((item) => item.companyName)

      const res =
        await this.vmstUnemploymentClientService.submitJobSearchConfirmation({
          galdurXRoadAPIModelsJobSearchConfirmationCreateJobSearchConfirmationRequest:
            { applicantId: applicantId, appliedCompanies },
        })

      return true
    } catch (e) {
      this.logger.error(
        '[VMST-Job-search-confirmation] - Error submitting or fetching applicantId',
      )
      throw new Error(e)
    }
  }
}
