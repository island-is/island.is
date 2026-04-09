import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  VmstUnemploymentClientService,
  GaldurXRoadAPIModelsApplicantInfoResponse,
  GaldurXRoadAPIModelsApplicantInfoSupportDataResponse,
  GaldurExternalDomainRequestsUpdateApplicantRequest,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { generateAnswers } from './edit-unemployment-information.utils'

interface ApplicationInformationWithSupportData {
  currentApplication: GaldurXRoadAPIModelsApplicantInfoResponse
  supportData: GaldurXRoadAPIModelsApplicantInfoSupportDataResponse
}

@Injectable()
export class EditUnemploymentInformationService extends BaseTemplateApiService {
  constructor(
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.EDIT_UNEMPLOYMENT_INFORMATION)
  }

  async getEmptyApplication({
    auth,
  }: TemplateApiModuleActionProps): Promise<ApplicationInformationWithSupportData> {
    const results =
      await this.vmstUnemploymentClientService.getCurrentApplicationForActions(
        auth,
      )

    const supportData =
      await this.vmstUnemploymentClientService.getCurrentApplicationSupportDataForActions()

    return {
      currentApplication: results,
      supportData,
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { answers, externalData } = application
    const answerObject = generateAnswers(answers, externalData)
    const reqObject: GaldurExternalDomainRequestsUpdateApplicantRequest =
      answerObject

    await this.vmstUnemploymentClientService.updateCurrentApplicationForActions(
      {
        ssn: auth.nationalId,
        galdurExternalDomainRequestsUpdateApplicantRequest: reqObject,
      },
    )
  }
}
