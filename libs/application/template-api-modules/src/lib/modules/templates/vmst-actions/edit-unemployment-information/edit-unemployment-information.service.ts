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
    const [currentApplication, supportData] = await Promise.all([
      this.vmstUnemploymentClientService.getCurrentApplicationForActions(auth),
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
    const { answers, externalData } = application
    const answerObject = generateAnswers(answers, externalData)
    const reqObject: GaldurExternalDomainRequestsUpdateApplicantRequest =
      answerObject

    console.log('reqObject', reqObject)
    throw new TemplateApiError(
      {
        title: 'Not implemented',
        summary: 'This feature is not yet implemented',
      },
      400,
    )
    // await this.vmstUnemploymentClientService.updateCurrentApplicationForActions(
    //   {
    //     ssn: auth.nationalId,
    //     galdurExternalDomainRequestsUpdateApplicantRequest: reqObject,
    //   },
    // )
  }
}
