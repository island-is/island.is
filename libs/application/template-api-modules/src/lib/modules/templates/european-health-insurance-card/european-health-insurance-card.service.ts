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

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    private readonly ehicApi: EhicApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
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

    const applicants = this.getObjectKey(application.answers, true)
    const apply: string[] = []

    if (applicants.includes(`${cardType}-${userData?.nationalId}`)) {
      apply.push(userData?.nationalId)
    }

    if (applicants.includes(`${cardType}-${spouseData?.nationalId}`)) {
      apply.push(userData?.nationalId)
    }

    for (let i = 0; i < custodyData?.length; i++) {
      if (applicants.includes(`${cardType}-${custodyData[i].nationalId}`)) {
        apply.push(custodyData[i].nationalId)
      }
    }

    this.logger.info(apply)

    return apply
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    const nridArr = this.getApplicants(application)

    try {
      const resp = await this.ehicApi.cardStatus({
        usernationalid: auth.nationalId,
        applicantnationalids: nridArr,
      })

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
    const applicants = this.getApplicants(application, 'apply')

    for (let i = 0; i < applicants.length; i++) {
      await this.ehicApi.requestCard({
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
    const applicants = this.getApplicants(application, 'temp')

    for (let i = 0; i < applicants.length; i++) {
      await this.ehicApi.requestCard({
        applicantnationalid: applicants[i],
        cardtype: 'pdf',
        usernationalid: auth.nationalId,
      })
    }
  }

  async getTemporaryCard({ auth, application }: TemplateApiModuleActionProps) {
    return this.ehicApi.fetchTempPDFCard({
      applicantnationalid: auth.nationalId,
      cardnumber: '00',
      usernationalid: auth.nationalId,
    })
  }
}
