import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { WorkMachinesClientService } from '@island.is/clients/work-machines'
import {
  DriversLicense,
  DrivingLicenseApi,
} from '@island.is/clients/driving-license'
import {
  GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class ActivationAllowanceService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly workMachineClientService: WorkMachinesClientService,
    private readonly drivingLicenceClientService: DrivingLicenseApi,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.ACTIVATION_ALLOWANCE)
  }
  // TODO: Implement functions as needed

  async createApplication({
    auth,
  }: TemplateApiModuleActionProps): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel> {
    const application =
      this.vmstUnemploymentClientService.getEmptyActivityGrantApplication(auth)

    return application
  }

  async getDrivingLicense({
    auth,
  }: TemplateApiModuleActionProps): Promise<DriversLicense> {
    return await this.drivingLicenceClientService.getCurrentLicense({
      token: auth.authorization,
    })
  }

  async completeApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}
