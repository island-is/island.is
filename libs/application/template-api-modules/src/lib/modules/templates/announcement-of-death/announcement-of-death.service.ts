import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { FasteignirApi } from '@island.is/clients/assets'
import { RoleConfirmationEnum } from './types'
import { SharedTemplateApiService } from '../../shared'
import { generateTestEmail } from './emailGenerators'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { baseMapper } from './announcement-of-death-utils'

import { isPerson } from 'kennitala'

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

    // On entry shouldn't throw errors but rather be handled
    // in the frontend
    if (!estates?.length || estates.length === 0) {
      return {
        success: false,
        estates: [],
      }
    }

    // TODO IMPORTANT: Address edge cases for multiple deceased familiy members in
    //                 the next iteration before feature flag is lifted
    const estate = estates[0]

    // Mark answer state
    estate.assets = estate.assets.map(baseMapper)
    estate.vehicles = [
      ...estate.vehicles,
      ...estate.ships,
      ...estate.flyers,
    ].map(baseMapper)
    estate.estateMembers = estate.estateMembers.map(baseMapper)

    // TODO: Move this to some other function that happens on a transition from
    // a selection of a deceased relative.
    // That is: if multiple deceased relatives exist have some selection.
    // OR: think about a way to select from the mapper.
    const updatedAnswers = {
      ...application.answers,
      ...estate,
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
    if (
      application.answers?.roleConfirmation === RoleConfirmationEnum.DELEGATE
    ) {
      const syslumennOnEntryData: any =
        application.externalData.syslumennOnEntry
      const electPerson: any = application.answers?.electPerson
      const electPersonNationalId: string =
        electPerson.electedPersonNationalId ?? ''

      if (!isPerson(electPersonNationalId)) {
        return {
          success: false,
        }
      }

      const changeEstateParams = {
        from: application.applicant,
        to: electPersonNationalId,
        caseNumber: syslumennOnEntryData?.data?.malsnumer ?? '',
      }
      try {
        await this.syslumennService.changeEstateRegistrant(
          changeEstateParams.from,
          changeEstateParams.to,
          changeEstateParams.caseNumber,
        )
      } catch (e) {
        return { success: false }
      }
    }

    return { success: true }
  }
}
