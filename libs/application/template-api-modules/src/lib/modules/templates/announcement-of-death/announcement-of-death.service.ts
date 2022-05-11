import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  DataUploadResponse,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { FasteignirApi } from '@island.is/clients/assets'
import { NationalRegistry, RoleConfirmationEnum, PickRole } from './types'
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

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    if ('errors' in updateApplicationResponse) {
      this.logger.error(
        'Failed to insert Syslumenn Data into answers',
        updateApplicationResponse,
      )
    }

    return {
      success: true,
      estates,
      relationOptions,
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
      (application.answers?.pickRole as PickRole).roleConfirmation ===
      RoleConfirmationEnum.DELEGATE
    ) {
      const syslumennOnEntryData: any =
        application.externalData.syslumennOnEntry
      const electPerson: any = (application.answers?.pickRole as PickRole)
        .electPerson
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
    } else {
      const syslumennOnEntryData: any =
        application.externalData.syslumennOnEntry

      const nationalRegistryData = application.externalData.nationalRegistry
        ?.data as NationalRegistry
      const person: Person = {
        name: nationalRegistryData?.fullName,
        ssn: application.applicant,
        phoneNumber: application.answers.applicantPhone as string,
        city: nationalRegistryData?.address.city,
        homeAddress: nationalRegistryData?.address.streetAddress,
        postalCode: nationalRegistryData?.address.postalCode,
        signed: false,
        type: PersonType.AnnouncerOfDeathCertificate,
        email: application.answers.applicantEmail as string,
      }

      const uploadDataName = 'aod0.1'
      const uploadDataId = 'aod0.1'

      const extraData = {
        caseNumber: application.answers.caseNumber as string,
        notifier: JSON.stringify({
          name: application.answers.applicantName as string,
          ssn: application.applicant,
          phoneNumber: application.answers.applicantPhone as string,
          email: application.answers.applicantEmail as string,
          relation: application.answers.applicantRelation as string,
        }),
        knowledgeOfOtherWill: application.answers.knowledgeOfOtherWills.toString(),
        estateMembers: JSON.stringify(application.answers.estateMembers),
        assets: JSON.stringify(application.answers.assets),
        vehicles: JSON.stringify(application.answers.vehicles),
        bankcodeSecuritiesOrShares: application.answers.bankStockOrShares.toString(),
        selfOperatedCompany: application.answers.ownBusinessManagement.toString(),
        occupationRightViaCondominium: application.answers.occupationRightViaCondominium.toString(),
        assetsAbroad: application.answers.assetsAbroad.toString(),
        districtCommissionerHasWill: application.answers.districtCommissionerHasWill.toString(),
        prenuptialAgreement: application.answers.marriageSettlement as string,
        certificateOfDeathAnnouncement: application.answers
          .certificateOfDeathAnnouncement as string,
        authorizationForFuneralExpenses: application.answers
          .authorizationForFuneralExpenses as string,
        financesDataCollectionPermission: application.answers
          .financesDataCollectionPermission as string,
      }

      const result: DataUploadResponse = await this.syslumennService
        .uploadData(
          [person],
          undefined,
          extraData,
          uploadDataName,
          uploadDataId,
        )
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })

      if (!result.success) {
        throw new Error(
          'Application submission failed on syslumadur upload data',
        )
      }
      return { success: result.success, id: result.caseNumber }
    }
  }
}
