import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { IdentityService } from '@island.is/nest/identity'

export const MAX_OUT_OF_DATE_MONTHS = 6

@Injectable()
export class IdentityApiService extends BaseTemplateApiService {
  constructor(private readonly identityService: IdentityService) {
    super('IdentityApi')
  }

  async identity({ auth }: TemplateApiModuleActionProps) {
    return this.identityService.getIdentity(auth.nationalId)
  }
}
