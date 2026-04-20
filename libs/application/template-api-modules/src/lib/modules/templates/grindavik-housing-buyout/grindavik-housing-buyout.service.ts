import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import {
  NationalRegistryV3ApplicationsClientService,
  ResidenceEntryDto,
} from '@island.is/clients/national-registry-v3-applications'
import {
  getDomicileOnDate,
  formatBankInfo,
  getPreemptiveErrorDetails,
} from './grindavik-housing-buyout.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  GrindavikHousingBuyoutAnswers,
  prerequisites,
} from '@island.is/application/templates/grindavik-housing-buyout'

import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { YES } from '@island.is/application/core'

type CheckResidence = {
  residenceHistory: ResidenceEntryDto
  realEstateId: string
  realEstateAddress: string
}

@Injectable()
export class GrindavikHousingBuyoutService extends BaseTemplateApiService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private nationalRegistryApi: NationalRegistryV3ApplicationsClientService,
    private propertiesApi: FasteignirApi,
  ) {
    super(ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as GrindavikHousingBuyoutAnswers

    const applicant: Person = {
      name: answers.applicant.name,
      ssn: answers.applicant.nationalId,
      phoneNumber: answers.applicant.phoneNumber ?? '',
      email: answers.applicant.email ?? '',
      homeAddress: answers.applicant.address ?? '',
      postalCode: answers.applicant.postalCode ?? '',
      city: answers.applicant.city ?? '',
      signed: false,
      type: PersonType.Plaintiff,
    }

    const counterParties: Person[] =
      answers.additionalOwners?.map((owner) => ({
        name: owner.name ?? '',
        ssn: owner.nationalId ?? '',
        phoneNumber: owner.phone ?? '',
        email: owner.email ?? '',
        homeAddress: '',
        postalCode: '',
        city: '',
        signed: false,
        type: PersonType.CounterParty,
      })) ?? []

    const confirmsLoanTakeover =
      answers.confirmLoanTakeover?.includes(YES) ?? false
    const hasLoanFromOtherProvider =
      answers.loanProviders.loans?.some((x) => x.otherProvider) ?? false
    const noLoanCheckbox =
      answers.loanProviders.hasNoLoans?.includes(YES) ?? false
    const hasNoLoans =
      noLoanCheckbox && answers.loanProviders.loans?.length === 0
    const wishesForPreemptiveRights =
      answers.preemptiveRight.preemptiveRightWish === YES
    const preemptiveRightType =
      answers.preemptiveRight.preemptiveRightType ?? []
    const otherOwnersBankInfo = answers.additionalOwners?.map((x) => ({
      nationalId: x.nationalId,
      bankInfo: formatBankInfo(x.bankInfo),
    }))

    const extraData: { [key: string]: string } = {
      applicationId: application.id,
      applicantBankInfo: formatBankInfo(answers.applicantBankInfo),
      residenceData: JSON.stringify(
        application.externalData.checkResidence.data,
      ),
      propertyData: JSON.stringify(
        application.externalData.getGrindavikHousing.data,
      ),
      preferredDeliveryDate: answers.deliveryDate ?? '',
      otherOwnersBankInfo: JSON.stringify(otherOwnersBankInfo),
      loans: JSON.stringify(answers.loanProviders.loans),
      hasLoanFromOtherProvider: hasLoanFromOtherProvider.toString(),
      hasNoLoans: hasNoLoans.toString(),
      confirmsLoanTakeover: confirmsLoanTakeover.toString(),
      wishesForPreemptiveRights: wishesForPreemptiveRights.toString(),
      preemptiveRightType: JSON.stringify(preemptiveRightType),
    }

    const uploadDataName = 'Umsókn um kaup á íbúðarhúsnæði í Grindavík'
    const uploadDataId = 'grindavik-umsokn-1'

    // Preemptive error check
    try {
      await this.syslumennService.uploadDataPreemptiveErrorCheck(
        [applicant, ...counterParties],
        [],
        extraData,
        uploadDataName,
        uploadDataId,
      )
    } catch (error) {
      const details = getPreemptiveErrorDetails(error)
      // Only throw template api error if we get details back
      if (details) {
        throw new TemplateApiError(details, 400)
      }
    }

    const response = await this.syslumennService.uploadData(
      [applicant, ...counterParties],
      [],
      extraData,
      uploadDataName,
      uploadDataId,
    )
    return { ...response, applicationId: application.id }
  }

  /**
   * Looks up the residence of a person on a given date. First it checks the current residence and then looks up the residence history.
   * This is due to missing data for individuals that have registrations from before 1986 from the history service.
   * Returns null if no residence is found on either the current residence or the residence history.
   */
  async findResidenceOnDate(
    nationalId: string,
    dateInQuestion: string,
    auth: User,
  ): Promise<ResidenceEntryDto | null> {
    //First off we check the current residence and check if that is on said date
    const currentResidence = await this.nationalRegistryApi.getCurrentResidence(
      nationalId,
      auth,
    )

    const currentResidenceOnDate = currentResidence
      ? getDomicileOnDate([currentResidence], dateInQuestion)
      : null

    if (currentResidenceOnDate) {
      //If we have a residence on the date in question we return that
      return currentResidenceOnDate
    }

    // The current residence is not at the time or the data is missing. Then we need to get the residence history and check if we have a residence at the time.
    const residenceHistory = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
      auth,
    )

    const domicileOn10nov = getDomicileOnDate(residenceHistory, dateInQuestion)

    return domicileOn10nov
  }

  async checkResidence({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CheckResidence> {
    const dateInQuestion = '2023-11-10'

    const residenceOnDate = await this.findResidenceOnDate(
      auth.nationalId,
      dateInQuestion,
      auth,
    )

    // gervimaður færeyjar pass through
    if (
      (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
      auth.nationalId === '0101302399'
    ) {
      return {
        residenceHistory: residenceOnDate as ResidenceEntryDto,
        realEstateId: 'F12345',
        realEstateAddress: 'Vesturhóp 34, 240 Grindavík',
      }
    }

    if (!residenceOnDate) {
      throw new TemplateApiError(
        {
          summary: prerequisites.errors.noResidenceRecordForDateDescription,
          title: prerequisites.errors.noResidenceRecordForDateTitle,
        },
        400,
      )
    }

    if (residenceOnDate.postalCode !== '240') {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.noResidenceDescription,
            values: { locality: residenceOnDate?.city ?? 'fannst ekki' },
          },
          title: prerequisites.errors.noResidenceTitle,
        },
        400,
      )
    }

    if (!residenceOnDate.realEstateNumber) {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.noRealEstateNumberWasFoundDescription,
            values: {
              streetName: residenceOnDate?.streetName ?? 'fannst ekki',
            },
          },
          title: prerequisites.errors.noRealEstateNumberWasFoundTitle,
        },
        400,
      )
    }

    return {
      residenceHistory: residenceOnDate,
      realEstateId: residenceOnDate.realEstateNumber,
      realEstateAddress: residenceOnDate.streetName,
    }
  }

  async getGrindavikHousing({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { realEstateId, realEstateAddress } =
      (application.externalData.checkResidence.data as CheckResidence) ??
      undefined

    if (application.externalData.checkResidence.status === 'failure') {
      // Since the checkResidence step failed and there is currently no way to stop the propogation of dataprovider calls,
      // as have no residence information we dont want to display any further errors or try any other calls so we return a "success" with an error indicator.
      return { error: 'noResidence' }
    }

    let property: Fasteign | undefined

    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      property = this.mockGetFasteign(realEstateId)
    } else {
      property = await this.getRealEstatesWithAuth(auth).fasteignirGetFasteign({
        fasteignanumer: realEstateId,
      })
    }

    if (!property) {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.propertyNotFoundDescription,
            values: {
              streetName: realEstateAddress,
            },
          },
          title: prerequisites.errors.propertyNotFoundTitle,
        },
        400,
      )
    }

    const { thinglystirEigendur } = property

    const isOwner = thinglystirEigendur?.thinglystirEigendur?.some(
      (eigandi) => {
        return eigandi.kennitala === auth.nationalId
      },
    )

    if (!isOwner) {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.youAreNotTheOwnerDescription,
            values: {
              streetName: realEstateAddress,
            },
          },
          title: prerequisites.errors.youAreNotTheOwnerTitle,
        },
        400,
      )
    }
    return property
  }

  async rejectedByOrganization({ application }: TemplateApiModuleActionProps) {
    // Do something when rejected by syslumenn?
  }

  async approvedByOrganization({ application }: TemplateApiModuleActionProps) {
    // Do something when approved by syslumenn?
  }

  mockGetFasteign(fasteignaNumer: string): Fasteign | undefined {
    return {
      fasteignanumer: 'F12345',
      sjalfgefidStadfang: {
        stadfanganumer: 1234,
        landeignarnumer: 567,
        postnumer: 113,
        sveitarfelagBirting: 'Reykjavík',
        birting: 'Vesturhóp 34, 240 Grindavík',
        birtingStutt: 'Vesturhóp 34',
      },
      fasteignamat: {
        gildandiFasteignamat: 50000000,
        fyrirhugadFasteignamat: 55000000,
        gildandiMannvirkjamat: 30000000,
        fyrirhugadMannvirkjamat: 35000000,
        gildandiLodarhlutamat: 20000000,
        fyrirhugadLodarhlutamat: 25000000,
        gildandiAr: 2024,
        fyrirhugadAr: 2025,
      },
      landeign: {
        landeignarnumer: '123456',
        lodamat: 75000000,
        notkunBirting: 'Íbúðarhúsalóð',
        flatarmal: '300000',
        flatarmalEining: 'm²',
      },
      thinglystirEigendur: {
        thinglystirEigendur: [
          {
            nafn: 'Gervimaður Danmörk',
            kennitala: '0101302479',
            eignarhlutfall: 0.5,
            kaupdagur: new Date(),
            heimildBirting: 'Afsal',
          },
          {
            nafn: 'Gervimaður Færeyjar',
            kennitala: '0101302399',
            eignarhlutfall: 0.5,
            kaupdagur: new Date(),
            heimildBirting: 'Afsal',
          },
        ],
      },
      notkunareiningar: {
        notkunareiningar: [
          {
            birtStaerdMaelieining: 'm²',
            notkunareininganumer: '010101',
            fasteignanumer: 'F12345',
            stadfang: {
              birtingStutt: 'RVK',
              birting: 'Reykjavík',
              landeignarnumer: 1234,
              sveitarfelagBirting: 'Reykjavík',
              postnumer: 113,
              stadfanganumer: 1234,
            },
            merking: 'SomeValue',
            notkunBirting: 'SomeUsage',
            skyring: 'SomeDescription',
            byggingararBirting: 'SomeYear',
            birtStaerd: 100,
            fasteignamat: {
              gildandiFasteignamat: 50000000,
              fyrirhugadFasteignamat: 55000000,
              gildandiMannvirkjamat: 30000000,
              fyrirhugadMannvirkjamat: 35000000,
              gildandiLodarhlutamat: 20000000,
              fyrirhugadLodarhlutamat: 25000000,
              gildandiAr: 2024,
              fyrirhugadAr: 2025,
            },
            brunabotamat: 100000000,
          },
        ],
      },
    }
  }
}
