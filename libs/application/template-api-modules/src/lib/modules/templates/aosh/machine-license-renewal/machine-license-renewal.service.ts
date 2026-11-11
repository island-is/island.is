import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { MachineLicenseRights } from '@island.is/application/templates/aosh/machine-license-renewal'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { mockMachineLicenseRights } from './machine-license-renewal.mock'

@Injectable()
export class MachineLicenseRenewalService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.MACHINE_LICENSE_RENEWAL)
  }

  // TODO: Fetch the rights from Vinnueftirlitið instead of returning mock data, and add a submitApplication action once their renewal endpoint exists
  async getMachineLicenseRights(): Promise<MachineLicenseRights> {
    return mockMachineLicenseRights
  }
}
