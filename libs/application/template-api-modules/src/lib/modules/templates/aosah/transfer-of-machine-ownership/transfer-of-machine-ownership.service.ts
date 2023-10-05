import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { getValueViaPath } from '@island.is/application/core'
import {
  generateApplicationApprovedEmail,
  generateAssignApplicationEmail,
} from '../emailGenerators'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { ApiMachinesGetRequest, MachinesApi } from '@island.is/clients/aosah/transfer-of-machine-ownership'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class TransferOfMachineOwnershipTemplateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly machinesApi: MachinesApi,
  ) {
    super(ApplicationTypes.ADMINISTRATION_OF_OCCUPATIONAL_SAFETY_AND_HEALTH) // Maybe change
  }

  private machinesApiWithAuth(auth: Auth) {
    return this.machinesApi.withMiddleware(new AuthMiddleware(auth));
  }

  async getMachines(auth: Auth, parameters: ApiMachinesGetRequest) {
    console.log('getMachines', auth, parameters);
    return await this.machinesApiWithAuth(auth).apiMachinesGet({ onlyShowOwnedMachines: true, ...parameters });
  }
}
