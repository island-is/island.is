import { Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../../types'

import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'

@Injectable()
export class SignatureListSigningService extends BaseTemplateApiService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.SIGNATURE_LIST_SIGNING)
  }

  async signList({ application }: TemplateApiModuleActionProps) {
     // Pretend to be doing stuff for a short while
     await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  async canSign({ auth, application }: TemplateApiModuleActionProps) {
    const res=  await this.signatureCollectionClientService.canSign(auth.nationalId)
    return res.success
  }
}