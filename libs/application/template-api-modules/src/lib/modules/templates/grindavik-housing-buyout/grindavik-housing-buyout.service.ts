import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'

import { SyslumennService } from '@island.is/clients/syslumenn'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import getDomicileAtPostalCodeOnDate from './grindavik-housing-buyout.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import { notEligible } from '@island.is/application/templates/grindavik-housing-buyout'

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

  async checkResidence({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CheckResidence> {
    const result = ''

    const data = await this.nationalRegistryApi.getResidenceHistory(
      auth.nationalId,
    )
    // gervimaður færeyjar pass through
    if (auth.nationalId === '0101302399') {
      return {
        realEstateId: 'F12345',
      }
    }
    console.log('residence history : ', data)

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
    if (realEstateId === 'F12345') {
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
              brunabotamat: 1000000,
            },
          ],
        },
      }
    }

    console.log('Real estate id', realEstateId)

    const property = await this.propertiesApi.fasteignirGetFasteign({
      fasteignanumer: realEstateId,
    })

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

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const result = ''
    return result
  }
}
