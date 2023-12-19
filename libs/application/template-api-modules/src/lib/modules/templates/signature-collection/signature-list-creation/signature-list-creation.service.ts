import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'

import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'
import { generateApplicationApprovedEmail } from './emailGenerators '

@Injectable()
export class SignatureListCreationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.SIGNATURE_LIST_CREATION)
  }

  async createLists({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Use the shared service to send an email using a custom email generator
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async canCreate({ auth, application }: TemplateApiModuleActionProps) {
    const res = await this.signatureCollectionClientService.canCreate(
      auth.nationalId,
    )
    return res.success
  }

  async isOwner({ auth, application }: TemplateApiModuleActionProps) {
    const res = await this.signatureCollectionClientService.isOwner(
      auth.nationalId,
    )
    return res.success
  }
}
