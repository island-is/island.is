import { Injectable } from '@nestjs/common'
import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import * as kennitala from 'kennitala'

import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class FinancialStatementsInaoTemplateService {
  constructor(
    private financialStatementsService: FinancialStatementsInaoClientService,
  ) {}

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth

    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementsService.getClientType('individual')
    } else {
      return this.financialStatementsService.getUserClientType(nationalId)
    }
  }
}
