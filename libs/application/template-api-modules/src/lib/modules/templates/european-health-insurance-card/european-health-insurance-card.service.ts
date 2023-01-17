import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  EuropeanHealtInsuranceCardConfig,
  EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG,
} from './config/europeanHealthInsuranceCardConfig'
import {
  CardResponse,
  CardType,
  SentStatus,
} from './dto/european-health-insurance-card.dtos'

@Injectable()
export class EuropeanHealthInsuranceCardService extends BaseTemplateApiService {
  constructor(
    @Inject(EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG)
    private ehicConfig: EuropeanHealtInsuranceCardConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD)
  }

  async getCardResponse() {
    //console.log(auth)
    //console.log(application)
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
}
