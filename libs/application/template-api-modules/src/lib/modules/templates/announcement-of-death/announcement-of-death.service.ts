import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { FasteignirApi } from '@island.is/clients/assets'
import { NationalRegistry, RealEstateAddress } from './types'
import {
  ApplicationWithAttachments as Application,
  getValueViaPath,
} from '@island.is/application/core'
import { SharedTemplateApiService } from '../../shared'
import { generateTestEmail } from './emailGenerators'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { estateMapper } from './announcement-of-death-utils'

const UPDATE_APPLICATION = `
mutation UpdateApplication($input: UpdateApplicationInput!) {
  updateApplication(input: $input) {
    id
  }
}
`

@Injectable()
export class AnnouncementOfDeathService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly nationalRegistryPersonApi: EinstaklingarApi,
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fasteignirApi: FasteignirApi,
  ) {}

  async syslumennOnEntry({ application, auth }: TemplateApiModuleActionProps) {
    const estates = await this.syslumennService.getEstateRegistrant(
      application.applicant,
    )

    // TODO: Move this to some other function that happens on a transition from
    // a selection of a deceased relative.
    // That is: if multiple deceased relatives exist have some selection.
    // OR: think about a way to select from the mapper.
    const updatedAnswers = {
      ...application.answers,
      ...estateMapper(estates[0]),
    }

    const updateApplicationResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(auth.authorization, UPDATE_APPLICATION, {
        input: {
          id: application.id,
          answers: updatedAnswers,
        },
      })
      .then((response) => response.json())

    if ('errors' in updateApplicationResponse) {
      this.logger.error(
        'Failed to insert Syslumenn Data into answers',
        updateApplicationResponse,
      )
    }

    return {
      success: true,
      estates,
    }
  }

  async sendTestEmail({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateTestEmail,
      application,
    )
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    return { success: true }
  }
}
