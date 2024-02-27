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

import { FasteignirApi } from '@island.is/clients/assets'

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

    console.log('residence history : ', data)

    let dateInQuestion = '2023-10-11'
    let postalCode = '240'

    const danmork = {
      //Gervimaður danmörk pass through
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
      realEstateId: grindavikDomicile.realEstateNumber ?? '12345',
    }
  }

  async getGrindavikHousing({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const result = ''

    console.log(application.externalData)
    const { realEstateId } =
      (application.externalData.checkResidence.data as CheckResidence) ??
      undefined

    console.log('Real estate id', realEstateId)

    const property = await this.propertiesApi.fasteignirGetFasteign({
      fasteignanumer: realEstateId,
    })

    const fasteign = {
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
            kennitala: '2222222222',
            eignarhlutfall: 0.5,
            kaupdagur: new Date(),
            heimildBirting: 'A+',
          },
          {
            nafn: 'Jóna Jónasdóttir',
            kennitala: '3333333333',
            eignarhlutfall: 0.5,
            kaupdagur: new Date(),
            heimildBirting: 'A+',
          },
        ],
      },
      notkunareiningar: {
        brunabotamat: 1000000,
      },
    }
    /*




    birtStaerdMaelieining?: string | null;

    notkunareininganumer?: string | null;

    fasteignanumer?: string | null;

    stadfang?: Stadfang | null;

    merking?: string | null;

    notkunBirting?: string | null;

    skyring?: string | null;
    byggingararBirting?: string | null;

    birtStaerd?: number;

    fasteignamat?: Fasteignamat | null;
 
    brunabotamat?: number;

    */

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
        eigandi.kennitala
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
}
