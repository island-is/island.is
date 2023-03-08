import { Inject, Injectable } from '@nestjs/common'
import { EhicApi } from '@island.is/clients/ehic-client-v1'

import { EhicClientService } from '@island.is/clients/ehic-client-v1'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  EuropeanHealtInsuranceCardConfig,
  EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG,
} from './config/europeanHealthInsuranceCardConfig'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  CardResponse,
  ApplicantCard,
} from './dto/european-health-insurance-card.dtos'
import { TemplateApiModuleActionProps } from '../../../types'

// TODO: move to shared location
export interface NationalRegistry {
  address: any
  nationalId: string
  fullName: string
  name: string
  ssn: string
  length: number
  data: any
}

export interface TempData {
  data?: string | null

  fileName?: string | null

  contentType?: string | null
}

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    private readonly ehicApi: EhicApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  /** Helper function. Get's applicants by type. If no type is provided then it returns from national registry */
  getApplicants(
    application: ApplicationWithAttachments,
    cardType: string | null = null,
  ): string[] {
    const nridArr: string[] = []
    const userData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    if (userData?.nationalId) {
      this.logger.info('adding to arr')
      nridArr.push(userData.nationalId)
    }

    const spouseData = application?.externalData?.nationalRegistrySpouse
      ?.data as NationalRegistry
    if (spouseData?.nationalId) {
      nridArr.push(spouseData.nationalId)
    }

    const custodyData = (application?.externalData
      ?.childrenCustodyInformation as unknown) as NationalRegistry[]
    for (let i = 0; i < custodyData?.length; i++) {
      nridArr.push(custodyData[i].nationalId)
    }

    if (!cardType) {
      return nridArr
    }

    const applicants = application.answers[cardType] as string[]
    const apply: string[] = []

    for (let i = 0; i < applicants?.length; i++) {
      apply.push(applicants[i])
    }

    return apply
  }

  toCommaDelimitedList(arr: string[]) {
    let listString = ''
    for (let i = 0; i < arr.length; i++) {
      listString += arr[i]
      if (i !== arr.length - 1) {
        listString += ','
      }
    }
    return listString
  }

  /** Get's applicants that want a temporary card (PDF) and their current physical (plastic) card number */
  getPDFApplicantsAndCardNumber(
    application: ApplicationWithAttachments,
  ): ApplicantCard[] {
    const pdfApplicantArr: ApplicantCard[] = []

    const applicants = this.getApplicants(application, 'applyForPDF')
    // Initial card Response
    const cardResponse = application.externalData.cardResponse
      ?.data as CardResponse[]
    // New card response
    const newPlasticCardsResponse = application.externalData
      .applyForCardsResponse?.data as CardResponse[]

    if (applicants) {
      for (let i = 0; i < applicants.length; i++) {
        if (newPlasticCardsResponse && newPlasticCardsResponse.length > 0) {
          const newCardResponse = newPlasticCardsResponse.find(
            (x) => x.applicantNationalId === applicants[i],
          )
          if (newCardResponse) {
            const plasticCard = newCardResponse?.cards?.find(
              (x) => x.isPlastic === true,
            )
            if (plasticCard) {
              pdfApplicantArr.push({
                cardNumber: plasticCard.cardNumber ?? '',
                nrid: applicants[i],
              })
              continue
            }
          }
        }

        const currentCardResponse = cardResponse.find(
          (x) => x.applicantNationalId === applicants[i],
        )
        if (currentCardResponse) {
          const plasticCard = currentCardResponse?.cards?.find(
            (x) => x.isPlastic === true,
          )
          if (plasticCard) {
            pdfApplicantArr.push({
              cardNumber: plasticCard?.cardNumber ?? '',
              nrid: applicants[i],
            })
          }
        }
      }
    }

    return pdfApplicantArr
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    const nridArr = this.getApplicants(application)

    try {
      const resp = await this.ehicApi.cardStatus({
        usernationalid: auth.nationalId,
        applicantnationalids: this.toCommaDelimitedList(nridArr),
      })

      // TODO: Remove. Temporary malipulation of dummy data for Emilía Íris Sveinsdóttir
      for (let i = 0; i < resp.length; i++) {
        if (i === 0) {
          resp[i].applicantNationalId = '2409151460'
        }
        if (i === 1) {
          resp[i].applicantNationalId = '0107721419'
          resp[i].canApply = false
        }

        if (i === 2) {
          resp[i].applicantNationalId = '1111111119'
        }
      }

      resp.push({
        applicantNationalId: '3333333339',
        canApply: true,
        isInsured: true,
        cards: [],
      })

      return resp
    } catch (e) {
      this.logger.error(e)
    }
    return null
  }

  async applyForPhysicalAndTemporary(obj: TemplateApiModuleActionProps) {
    const result = await this.applyForPhysicalCard(obj)
    await this.applyForTemporaryCard(obj)
    return result
  }

  async applyForPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(application, 'applyForPlastic')
    const cardResponses: CardResponse[] = []

    for (let i = 0; i < applicants.length; i++) {
      const res = await this.ehicApi.requestCard({
        applicantnationalid: applicants[i],
        cardtype: 'plastic',
        usernationalid: auth.nationalId,
      })
      cardResponses.push(res)
    }

    return cardResponses
  }

  async applyForTemporaryCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(application, 'applyForPDF')

    for (let i = 0; i < applicants.length; i++) {
      await this.ehicApi.requestCard({
        applicantnationalid: applicants[i],
        cardtype: 'pdf',
        usernationalid: auth.nationalId,
      })
    }
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    const applicants = this.getPDFApplicantsAndCardNumber(application)
    const pdfArray: TempData[] = []

    for (let i = 0; i < applicants.length; i++) {
      if (applicants[i].nrid !== null && applicants[i].cardNumber !== null) {
        const res = await this.ehicApi.fetchTempPDFCard({
          applicantnationalid: applicants[i].nrid ?? '',
          cardnumber: applicants[i].cardNumber ?? '',
          usernationalid: auth.nationalId,
        })
        pdfArray.push(res)
      }
    }
    return pdfArray
  }
}
