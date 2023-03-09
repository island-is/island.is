import { EuropeanHealthInsuranceCardClientService } from '@island.is/clients/ehic-client-v1'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  CardResponse,
  CardInfo,
  CardType,
  SentStatus,
} from './dto/european-health-insurance-card.dtos'
import { TemplateApiModuleActionProps } from '../../../types'
import { Inject, Injectable } from '@nestjs/common'

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
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private api: EuropeanHealthInsuranceCardClientService,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  getObjectKey(obj: any, value: any) {
    return Object.keys(obj).filter((key) => obj[key] === value)
  }

  getApplicants(
    application: ApplicationWithAttachments,
    cardType: string | null = null,
  ): string[] {
    this.logger.info('getApplicants')
    const nridArr: string[] = []
    this.logger.info(application.externalData)
    this.logger.info(application.externalData.nationalRegistry?.data)
    const userData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    this.logger.info('userdata' + userData)
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
      this.logger.info(nridArr)
      return nridArr
    }

    const applicants = application.answers[cardType] as Array<any>
    const apply: string[] = []

    for (let i = 0; i < applicants?.length; i++) {
      this.logger.info('Adding: ' + applicants[i][0])

      apply.push(applicants[i][0])
    }

    this.logger.info(apply)

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

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    const nridArr = this.getApplicants(application)
    return this.api.getCardResponse(auth, nridArr)

    // try {

    //   const resp = await this.ehicApi.cardStatus({
    //     usernationalid: auth.nationalId,
    //     applicantnationalids: this.toCommaDelimitedList(nridArr),
    //   })

    //   // TODO: Remove. Temporary malipulation of dummy data for Emilía Íris Sveinsdóttir
    //   for (let i = 0; i < resp.length; i++) {
    //     if (i === 0) {
    //       resp[i].applicantNationalId = '2409151460'
    //     }
    //     if (i === 1) {
    //       resp[i].applicantNationalId = '0107721419'
    //     }

    //     if (i === 2) {
    //       resp[i].applicantNationalId = '1111111119'
    //     }
    //   }

    //   return resp
    // } catch (e) {
    //   this.logger.error(e)
    // }
    // return null
  }

  async applyForPhysicalAndTemporary(obj: TemplateApiModuleActionProps) {
    this.logger.info('applyForPhysicalAndTemporary')
    this.logger.info(obj)
    await this.applyForPhysicalCard(obj)
    await this.applyForTemporaryCard(obj)
    this.logger.info('applyForPhysicalAndTemporary return')
    return true
  }

  async applyForPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getApplicants(application, 'applyForPlastic')

    for (let i = 0; i < applicants.length; i++) {
      await this.api.requestCard(auth, {
        applicantnationalid: applicants[i],
        cardtype: 'plastic',
        usernationalid: auth.nationalId,
      })
    }
  }

  async applyForTemporaryCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    this.logger.info('applyForTemporaryCard')
    this.logger.info('Answers')
    this.logger.info(application.answers)
    this.logger.info('Applicants')
    this.logger.info(application.applicant)

    const applicants = this.getApplicants(application, 'applyForPDF')
    this.logger.info('applicants tenmp')
    this.logger.info(applicants)
    this.logger.info(applicants.toString())

    for (let i = 0; i < applicants.length; i++) {
      await this.ehicApi.requestCard({
        applicantnationalid: applicants[i],
        cardtype: 'pdf',
        usernationalid: auth.nationalId,
      })
    }
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    this.logger.info('getTemporaryCard')
    const applicants = this.getApplicants(application, 'applyForPDF')
    this.logger.info('applicants.length')
    this.logger.info(applicants.length)
    this.logger.info(applicants)
    const pdfArray: TempData[] = []

    for (let i = 0; i < applicants.length; i++) {
      this.logger.info('fetching' + i)
      this.logger.info(applicants[i])
      const res = await this.ehicApi.fetchTempPDFCard({
        applicantnationalid: applicants[i],
        cardnumber: '00',
        usernationalid: auth.nationalId,
      })

      this.logger.info('response')
      this.logger.info(res)
      pdfArray.push(res)
    }

    this.logger.info('pdfArray.length')
    this.logger.info(pdfArray.length)

    return pdfArray
  }
}
