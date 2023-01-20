import { Inject, Injectable } from '@nestjs/common'

import { Auth, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
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

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    // @Inject(EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG)
    // private ehicConfig: EuropeanHealtInsuranceCardConfig,
    // private nationalRegistryApi: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  async getCardResponse({ auth, application }: TemplateApiModuleActionProps) {
    console.log(auth)
    console.log(application)
    return {
      isInsured: true,
      nrid: '0004764579',
      cards: [
        {
          id: '12346',
          expires: new Date(),
          reSent: new Date(),
          issued: new Date(),
          sentStatus: SentStatus.SENT,
          type: CardType.PHYSICAL,
        },
      ],
    } as CardResponse
  }

  async applyForPhysicalCard({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
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
