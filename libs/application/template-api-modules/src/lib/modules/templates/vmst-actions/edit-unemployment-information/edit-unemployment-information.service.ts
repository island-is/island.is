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

interface ApplicationInformationWithSupportData {
  currentApplication: GaldurXRoadAPIModelsApplicantInfoResponse
  supportData: GaldurXRoadAPIModelsApplicantInfoSupportDataResponse
}

@Injectable()
export class EditUnemploymentInformationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
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
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { answers, externalData } = application
    const reqObject: GaldurExternalDomainRequestsUpdateApplicantRequest = {
      serviceAreaId: 'TODO',
      currentAddress: 'TODO',
      currentPostCodeId: 'TODO',
      passCode: 'TODO',
      bankAccount: {
        bankId: 'TODO',
        ledgerId: 'TODO',
        accountNumber: 'TODO',
      },
      preferredJobs: [
        {
          jobCodeId: 'TODO',
        },
      ],
      educationHistory: [],
      employmentHistory: [],
      drivingLicenses: [],
      workMachineRights: [],
      languageAbility: [],
      saveEURES: false,
    }

    await this.vmstUnemploymentClientService.updateCurrentApplicationForActions(
      {
        ssn: auth.nationalId,
        galdurExternalDomainRequestsUpdateApplicantRequest: reqObject,
      },
    )
  }
}
