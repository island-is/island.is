import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'
import {
  MachineLicenseDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { TemplateApiModuleActionProps } from '../../../types'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  DriversLicense,
  DrivingLicenseApi,
} from '@island.is/clients/driving-license'
import {
  GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'

@Injectable()
export class UnemploymentBenefitsService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly workMachineClientService: WorkMachinesClientService,
    private readonly drivingLicenceClientService: DrivingLicenseApi,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.UNEMPLOYMENT_BENEFITS)
  }

  async getWorkMachineLicenses({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<MachineLicenseDto> {
    const result = await this.workMachineClientService.getLicenses(auth, {
      xCorrelationID: application.id,
    })
    if (
      !result ||
      !result.licenseCategories ||
      !result.licenseCategories.length
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.licensesEmptyListDefault,
          summary: coreErrorMessages.licensesEmptyListDefault,
        },
        400,
      )
    }
    return {
      nationalId: result.nationalId,
      licenseCategories: result.licenseCategories,
    }
  }

  async getDrivingLicense({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<DriversLicense> {
    return await this.drivingLicenceClientService.getCurrentLicense({
      token: auth.authorization,
    })
  }

  async getEmptyApplication({
    auth,
  }: TemplateApiModuleActionProps): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationDto | null> {
    const results =
      await this.vmstUnemploymentClientService.getEmptyApplication(auth)

    // This also comes from result, might want to do something with this!
    // canApply: true
    // errorMessage: ""
    // hasApplicationInLast4Weeks: false
    // reopenApplication: false
    // success: true
    return results.unemploymentApplication || null
  }
}
