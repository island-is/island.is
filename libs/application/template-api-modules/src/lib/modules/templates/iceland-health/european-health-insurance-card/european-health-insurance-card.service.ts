import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  CardResponse,
  TempData,
  NationalRegistry,
  ApplicantCard,
  CardType,
  FormApplyType,
  Answer,
} from './types'
import { TemplateApiModuleActionProps } from '../../../../types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { EhicApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    private readonly ehicApi: EhicApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  private ehicApiWithAuth(auth: Auth) {
    return this.ehicApi.withMiddleware(new AuthMiddleware(auth))
  }

  /** Returns unique values of an array */
  onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index
  }

  /** Helper function. Get's applicants by type. If no type is provided then it returns from national registry */
  getApplicants(
    application: ApplicationWithAttachments,
    applyType: string | null = null,
  ): string[] {
    // Get from national registry
    if (!applyType) {
      const nridArr: string[] = []
      const userData = application.externalData.nationalRegistry
        ?.data as NationalRegistry

      if (userData?.nationalId) {
        nridArr.push(userData.nationalId)
      }

      const spouseData = application?.externalData?.nationalRegistrySpouse
        ?.data as NationalRegistry
      if (spouseData?.nationalId) {
        nridArr.push(spouseData.nationalId)
      }

      const custodyData = application?.externalData?.childrenCustodyInformation
        .data as NationalRegistry[]
      for (let i = 0; i < custodyData?.length; i++) {
        nridArr.push(custodyData[i].nationalId)
      }
      return nridArr.filter(this.onlyUnique)
    }

    if (applyType === FormApplyType.APPLYING_FOR_PLASTIC) {
      const ans = application.answers as unknown as Answer
      return ans.delimitations.applyForPlastic?.filter(this.onlyUnique)
    }

    return (application.answers[applyType] as string[])?.filter(this.onlyUnique)
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

    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PDF,
    )

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
              if (
                !pdfApplicantArr.some((x) => x.nationalId === applicants[i])
              ) {
                pdfApplicantArr.push({
                  cardNumber: plasticCard.cardNumber ?? '',
                  nationalId: applicants[i],
                })
              }
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
            if (!pdfApplicantArr.some((x) => x.nationalId === applicants[i])) {
              pdfApplicantArr.push({
                cardNumber: plasticCard?.cardNumber ?? '',
                nationalId: applicants[i],
              })
            }
          }
        }
      }
    }

    return pdfApplicantArr
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    const nridArr = this.getApplicants(application)
    if (nridArr?.length > 0) {
      try {
        const resp = await this.ehicApiWithAuth(auth).getEhicCardStatus({
          applicantnationalids: this.toCommaDelimitedList(nridArr),
        })

        if (!resp) {
          this.logger.error(
            'EHIC.API response empty from getCardResponse',
            resp,
          )
        }

        return resp
      } catch (error) {
        this.logger.error('EHIC.API error getCardResponse', error)
        throw error
      }
    }
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
    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PLASTIC,
    )
    const cardResponses: CardResponse[] = []

    for (let i = 0; i < applicants?.length; i++) {
      try {
        const res = await this.ehicApiWithAuth(auth).requestEhicCard({
          applicantnationalid: applicants[i],
          cardtype: CardType.PLASTIC,
        })
        cardResponses.push(res)
      } catch (error) {
        this.logger.error('EHIC.API error applyForPhysicalCard', error)
        throw error
      }
    }
    return cardResponses
  }

  async applyForTemporaryCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(
      application,
      FormApplyType.APPLYING_FOR_PDF,
    )

    for (let i = 0; i < applicants?.length; i++) {
      try {
        await this.ehicApiWithAuth(auth).requestEhicCard({
          applicantnationalid: applicants[i],
          cardtype: CardType.PDF,
        })
      } catch (error) {
        this.logger.error('EHIC.API error applyForTemporaryCard', error)
        throw error
      }
    }
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    const applicants = this.getPDFApplicantsAndCardNumber(application)
    const pdfArray: TempData[] = []

    for (let i = 0; i < applicants?.length; i++) {
      try {
        const { nationalId, cardNumber } = applicants[i]
        if (!nationalId || !cardNumber) {
          throw new Error('National ID or card number is missing')
        }
        const res = await this.ehicApiWithAuth(auth).fetchTempEhicPDFCard({
          applicantnationalid: nationalId,
          cardnumber: cardNumber,
        })
        pdfArray.push(res)
      } catch (error) {
        this.logger.error('EHIC.API error getTemporaryCard', error)
        throw error
      }
    }
    return pdfArray
  }
}
