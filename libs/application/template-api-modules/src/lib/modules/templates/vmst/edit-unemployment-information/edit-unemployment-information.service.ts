import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  VmstUnemploymentClientService,
  GaldurXRoadAPIModelsApplicantInfoResponse,
  GaldurXRoadAPIModelsApplicantInfoSupportDataResponse,
  GaldurExternalDomainRequestsUpdateApplicantRequest,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { generateAnswers } from './edit-unemployment-information.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMsgs } from '@island.is/application/templates/vmst/edit-unemployment-information'

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
    const resolvedApplicantId =
      await this.vmstUnemploymentClientService.resolveApplicant(auth)
    if (!resolvedApplicantId.applicantId) {
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
          summary: errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }
    const [currentApplication, supportData] = await Promise.all([
      this.vmstUnemploymentClientService.getCurrentApplicationForActions({
        id: resolvedApplicantId.applicantId,
      }),
      this.vmstUnemploymentClientService.getCurrentApplicationSupportDataForActions(),
    ])

    return {
      currentApplication,
      supportData,
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const resolvedApplicantId =
      await this.vmstUnemploymentClientService.resolveApplicant(auth)
    if (!resolvedApplicantId.applicantId) {
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
          summary: errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }
    const { answers, externalData } = application
    const answerObject = generateAnswers(answers, externalData)
    const reqObject: GaldurExternalDomainRequestsUpdateApplicantRequest =
      answerObject

    await this.vmstUnemploymentClientService.updateCurrentApplicationForActions(
      {
        applicantId: resolvedApplicantId.applicantId,
        galdurExternalDomainRequestsUpdateApplicantRequest: reqObject,
      },
    )
  }
}
