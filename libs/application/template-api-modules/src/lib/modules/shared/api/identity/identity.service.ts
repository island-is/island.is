import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { Identity, IdentityClientService } from '@island.is/clients/identity'

@Injectable()
export class IdentityService extends BaseTemplateApiService {
  constructor(private readonly identityService: IdentityClientService) {
    super('Identity')
  }

  async identity({
    auth,
  }: TemplateApiModuleActionProps): Promise<Identity | null> {
    return this.identityService.getIdentity(auth.nationalId)
  }
}
