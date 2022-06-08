import { Injectable } from '@nestjs/common'
import { FinancialStatementsInaoService } from '@island.is/api/domains/financial-statements-inao'

import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class FinancialStatementsInaoTemplateService {
  constructor(
    private financialStatementsService: FinancialStatementsInaoService,
  ) {}

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    return this.financialStatementsService.getUserClientType(auth.nationalId)
  }
}
