import { Injectable } from '@nestjs/common'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import * as kennitala from 'kennitala'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class FinancialStatementsInaoTemplateService extends BaseTemplateApiService {
  constructor(
    private financialStatementsService: FinancialStatementsInaoClientService,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENTS_INAO)
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth

    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementsService.getClientType('Einstaklingur')
    } else {
      return this.financialStatementsService.getUserClientType(nationalId)
    }
  }
}
