import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  DataUploadResponse,
  EstateRegistrant,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { Answers as aodAnswers } from '@island.is/application/templates/announcement-of-death/types'
import { FasteignirApi } from '@island.is/clients/assets'
import { NationalRegistry, RoleConfirmationEnum, PickRole } from './types'
import { SharedTemplateApiService } from '../../shared'
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
    if (estates.length === 1) {
      await this.updateEstateAnswer({ application, auth }, estates[0])
    }

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    return {
      success: true,
      estates,
      relationOptions,
    }
  }

  async updateEstateAnswer(
    { application, auth }: TemplateApiModuleActionProps,
    estate: EstateRegistrant,
  ) {
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
  }

  async assignElectedPerson({ application }: TemplateApiModuleActionProps) {
    const syslumennOnEntryData: any = application.externalData.syslumennOnEntry
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

      const uploadDataName = 'andlatstilkynning1.0 '
      const uploadDataId = 'andlatstilkynning1.0 '

      const answers = (application.answers as unknown) as aodAnswers

      const extraData = {
        caseNumber: answers.caseNumber,
        notifier: JSON.stringify({
          name: answers.applicantName,
          ssn: application.applicant,
          phoneNumber: answers.applicantPhone,
          email: answers.applicantEmail,
          relation: answers.applicantRelation,
        }),
        knowledgeOfOtherWill: answers.knowledgeOfOtherWills,
        estateMembers: JSON.stringify(answers.estateMembers),
        assets: JSON.stringify(answers.assets),
        vehicles: JSON.stringify(answers.vehicles),
        bankcodeSecuritiesOrShares: answers.bankStockOrShares.toString(),
        selfOperatedCompany: answers.ownBusinessManagement.toString(),
        occupationRightViaCondominium: answers.occupationRightViaCondominium.toString(),
        assetsAbroad: answers.assetsAbroad.toString(),
        districtCommissionerHasWill: answers.districtCommissionerHasWill.toString(),
        prenuptialAgreement: answers.marriageSettlement.toString(),
        certificateOfDeathAnnouncement: answers.certificateOfDeathAnnouncement,
        authorizationForFuneralExpenses: answers.authorizationForFuneralExpenses
          ? answers.authorizationForFuneralExpenses.toString()
          : 'false',
        financesDataCollectionPermission: answers.financesDataCollectionPermission
          ? answers.financesDataCollectionPermission.toString()
          : 'false',
        additionalInfo: answers.additionalInfo,
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
