import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
  UserProfile,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import getDomicileAtPostalCodeOnDate from './grindavik-housing-buyout.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  notEligible,
  GrindavikHousingBuyoutAnswers,
} from '@island.is/application/templates/grindavik-housing-buyout'

import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningInProduction } from '../parental-leave/constants'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

type CheckResidence = {
  realEstateId: string
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
    const { nationalRegistry, userProfile } = application.externalData
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
    const result = ''

    const data = await this.nationalRegistryApi.getResidenceHistory(
      auth.nationalId,
    )
    // gervimaður færeyjar pass through2399
    if (auth.nationalId === '0101302399') {
      return {
        realEstateId: 'F12345',
      }
    }

    let dateInQuestion = '2023-10-11'
    let postalCode = '240'

    const danmork = {
      dateInQuestion: '2009-07-30',
      postalCode: '301',
    }

    dateInQuestion = danmork.dateInQuestion
    postalCode = danmork.postalCode

    const grindavikDomicile = getDomicileAtPostalCodeOnDate(
      data,
      postalCode,
      dateInQuestion,
    )

    if (!grindavikDomicile) {
      throw new TemplateApiError(
        {
          summary: {
            ...notEligible.description,
            defaultMessage: notEligible.description.defaultMessage.replace(
              '{locality}',
              data[0]?.city ?? '',
            ),
          },
          title: notEligible.sectionTitle,
        },
        400,
      )
    }

    console.log(grindavikDomicile)

    /*if (!grindavikDomicile.realEstateNumber) {
      throw Error('No real estate number found')
    }*/

    return {
      realEstateId: grindavikDomicile?.realEstateNumber ?? '12345',
    }
  }

  async getGrindavikHousing({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { realEstateId } =
      (application.externalData.checkResidence.data as CheckResidence) ??
      undefined

    // mock from checkResidence function

    console.log('Real estate id', realEstateId)

    let property: Fasteign | undefined

    if (isRunningOnEnvironment('local')) {
      property = this.mockGetFasteign(realEstateId)
    } else {
      property = await this.propertiesApi.fasteignirGetFasteign({
        fasteignanumer: realEstateId,
      })
    }

    if (!property) {
      throw new TemplateApiError('No property found', 400)
    }

    const {
      fasteignamat,
      fasteignanumer,
      landeign,
      notkunareiningar,
      sjalfgefidStadfang,
      thinglystirEigendur,
    } = property

    const isOwner = thinglystirEigendur?.thinglystirEigendur?.some(
      (eigandi) => {
        return eigandi.kennitala === auth.nationalId
      },
    )

    if (!isOwner) {
      throw new TemplateApiError('Not an owner', 400)
    }

    const eining = notkunareiningar?.notkunareiningar?.find(
      (x) => x.fasteignanumer === realEstateId,
    )

    return eining
  }

  mockGetFasteign(fasteignaNumer: string): Fasteign | undefined {
    return {
      fasteignanumer: 'F12345',
      sjalfgefidStadfang: {
        stadfanganumer: 1234,
        landeignarnumer: 567,
        postnumer: 113,
        sveitarfelagBirting: 'Reykjavík',
        birting: 'Reykjavík',
        birtingStutt: 'RVK',
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
