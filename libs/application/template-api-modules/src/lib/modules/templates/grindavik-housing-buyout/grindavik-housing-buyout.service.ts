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
  NationalRegistryClientService,
  ResidenceHistoryEntryDto,
} from '@island.is/clients/national-registry-v2'
import { getDomicileOnDate } from './grindavik-housing-buyout.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  GrindavikHousingBuyoutAnswers,
  prerequisites,
} from '@island.is/application/templates/grindavik-housing-buyout'

import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

type CheckResidence = {
  residenceHistory: ResidenceHistoryEntryDto[]
  realEstateId: string
  realEstateAddress: string
}

@Injectable()
export class GrindavikHousingBuyoutService extends BaseTemplateApiService {
  constructor(
    private readonly syslumennService: SyslumennService,
    private nationalRegistryApi: NationalRegistryClientService,
    private propertiesApi: FasteignirApi,
  ) {
    super(ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT)
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

    const extraData: { [key: string]: string } = {
      applicationId: application.id,
      residenceData: JSON.stringify(
        application.externalData.checkResidence.data,
      ),
      propertyData: JSON.stringify(
        application.externalData.getGrindavikHousing.data,
      ),
      loans: JSON.stringify(answers.loans),
    }

    const uploadDataName = 'Umsókn um kaup á íbúðarhúsnæði í Grindavík'
    const uploadDataId = 'grindavik-umsokn-1'

    const response = await this.syslumennService.uploadData(
      [applicant],
      [],
      extraData,
      uploadDataName,
      uploadDataId,
    )
    return { ...response, applicationId: application.id }
  }

  async checkResidence({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CheckResidence> {
    const data = await this.nationalRegistryApi.getResidenceHistory(
      auth.nationalId,
    )

    if (data.length === 0) {
      throw new TemplateApiError(
        {
          summary: prerequisites.errors.residendHistoryNotFoundDescription,
          title: prerequisites.errors.residendHistoryNotFoundTitle,
        },
        400,
      )
    }

    // gervimaður færeyjar pass through
    if (
      (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
      auth.nationalId === '0101302399'
    ) {
      return {
        residenceHistory: data,
        realEstateId: 'F12345',
        realEstateAddress: 'Vesturhóp 34, 240 Grindavík',
      }
    }

    const dateInQuestion = '2023-11-10'
    const domicileOn10nov = getDomicileOnDate(data, dateInQuestion)

    if (!domicileOn10nov) {
      throw new TemplateApiError(
        {
          summary: prerequisites.errors.noResidenceRecordForDateDescription,
          title: prerequisites.errors.noResidenceRecordForDateTitle,
        },
        400,
      )
    }

    if (domicileOn10nov.postalCode !== '240') {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.noResidenceDescription,
            values: { locality: domicileOn10nov?.city ?? 'fannst ekki' },
          },
          title: prerequisites.errors.noResidenceTitle,
        },
        400,
      )
    }

    if (!domicileOn10nov.realEstateNumber) {
      throw new TemplateApiError(
        {
          summary: {
            ...prerequisites.errors.noRealEstateNumberWasFoundDescription,
            values: {
              streetName: domicileOn10nov?.streetName ?? 'fannst ekki',
            },
          },
          title: prerequisites.errors.noRealEstateNumberWasFoundTitle,
        },
        400,
      )
    }

    return {
      residenceHistory: data,
      realEstateId: domicileOn10nov.realEstateNumber,
      realEstateAddress: domicileOn10nov.streetName,
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
      property = await this.propertiesApi.fasteignirGetFasteign({
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
