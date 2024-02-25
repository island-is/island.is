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

    console.log(data)

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

    if (!grindavikDomicile.realEstateNumber) {
      throw Error('No real estate number found')
    }

    return {
      realEstateId: grindavikDomicile.realEstateNumber,
    }
  }

  async getGrindavikHousing({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const result = ''
    const { realEstateId } =
      (application.externalData.checkResidence.data as CheckResidence) ??
      undefined

    const s = await this.syslumennService.getPropertyDetails(realEstateId)

    const { propertyNumber, unitsOfUse, defaultAddress } = s

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

    return property
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const result = ''
    return result
  }
}
