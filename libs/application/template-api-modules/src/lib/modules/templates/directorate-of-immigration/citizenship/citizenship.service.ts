import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import {
  getChargeItemCodes,
  CitizenshipAnswers,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import { CitizenshipClient } from '@island.is/clients/directorate-of-immigration/citizenship'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { CitizenIndividual } from './types'

@Injectable()
export class CitizenshipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly citizenshipClient: CitizenshipClient,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as CitizenshipAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as CitizenshipAnswers

    // Submit the application
    await this.citizenshipClient.applyForCitizenship(auth)
  }

  async getCitizenshipIndividual({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CitizenIndividual | null> {
    const { nationalId } = auth
    const person = await this.nationalRegistryApi.getIndividual(nationalId)
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )
    const residenceHistory = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
    )

    // sort residence history so newest items are first, and if two items have the same date,
    // then the Iceland item will be first
    const countryIceland = 'IS'
    const sortedResidenceHistory = residenceHistory
      .filter((x) => x.dateOfChange)
      .sort((a, b) =>
        a.dateOfChange !== b.dateOfChange
          ? a.dateOfChange! > b.dateOfChange!
            ? -1
            : 1
          : a.country === countryIceland
          ? -1
          : 1,
      )

    // get the oldest change date for Iceland, where user did not move to another
    // country in between
    let lastChangeDate: Date | null = null
    for (let i = 0; i < sortedResidenceHistory.length; i++) {
      if (sortedResidenceHistory[i].country === countryIceland) {
        lastChangeDate = sortedResidenceHistory[i].dateOfChange
      } else {
        break
      }
    }

    return (
      person && {
        nationalId: person.nationalId,
        fullName: person.name,
        age: kennitala.info(person.nationalId).age,
        citizenship: citizenship && {
          code: citizenship.countryCode,
          name: citizenship.countryName,
        },
        address: person.legalDomicile && {
          streetAddress: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          locality: person.legalDomicile.locality,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        residenceInIcelandLastChangeDate: lastChangeDate,
        genderCode: person.genderCode,
      }
    )
  }

  //TODOx fjarlægja?
  async getResidency({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<any> {
    const { nationalId } = auth
    const residence = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
    )

    return residence
  }
}
