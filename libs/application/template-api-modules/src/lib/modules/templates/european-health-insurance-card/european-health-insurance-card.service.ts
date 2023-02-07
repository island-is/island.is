import { Inject, Injectable } from '@nestjs/common'

import { Auth, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

import { EhicApi } from '@island.is/clients/ehic-client-v1'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  EuropeanHealtInsuranceCardConfig,
  EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG,
} from './config/europeanHealthInsuranceCardConfig'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  CardResponse,
  CardInfo,
  CardType,
  SentStatus,
} from './dto/european-health-insurance-card.dtos'
import { TemplateApiModuleActionProps } from '../../../types'

export interface NationalRegistry {
  address: any
  nationalId: string
  fullName: string
  name: string
  ssn: string
  length: number
  data: any
}

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    private readonly ehic: EhicApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  getObjectKey(obj: any, value: any) {
    return Object.keys(obj).filter((key) => obj[key] === value)
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    // const nridArr = []
    // const nationalRegistryData = application.externalData.nationalRegistry
    //   ?.data as NationalRegistry
    // nridArr.push(nationalRegistryData.nationalId)

    // const nationalRegistryDataSpouse = application?.externalData
    //   ?.nationalRegistrySpouse?.data as NationalRegistry
    // nridArr.push(nationalRegistryDataSpouse.nationalId)

    // const nationalRegistryDataChildren = (application?.externalData
    //   ?.childrenCustodyInformation as unknown) as NationalRegistry[]
    // for (let i = 0; i < nationalRegistryDataChildren.length; i++) {
    //   nridArr.push(nationalRegistryDataChildren[i].nationalId)
    // }

    this.logger.info('EHIC: Getting response from service')

    try {
      const resp = await this.ehic.cardStatus({
        usernationalid: '0000000000',
        applicantnationalids: ['0000000000'],
      })
      // const resp = await this.ehic.requestCard({
      //   applicantnationalid: '0000000000',
      //   cardtype: 'plastic',
      //   usernationalid: '0000000000',
      // })

      this.logger.info('RESPINSE; ' + resp)
      this.logger.info('RESPINSE; ' + resp[0].applicantNationalId)

      return resp
    } catch (e) {
      this.logger.error(e)
    }
    return null
  }

  async applyForPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const applicants = this.getObjectKey(application.answers, true)
    console.log(auth)
    console.log(application)
    return {
      id: '5123459',
      expires: new Date(),
      reSent: new Date(),
      issued: new Date(),
      sentStatus: SentStatus.WAITING,
      type: CardType.PHYSICAL,
      nrid: '0000765589',
    } as CardInfo
  }

  async resendPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return {
      id: '5123459',
      nrid: '0000765589',
      expires: new Date(),
      reSent: new Date(),
      issued: new Date(),
      sentStatus: SentStatus.WAITING,
      type: CardType.PHYSICAL,
    } as CardInfo
  }

  async applyForTemporaryCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    return 'applied for temp card'
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    const byteArray = new Uint8Array(20)
    return byteArray
  }
}
