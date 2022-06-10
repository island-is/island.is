import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

@Injectable()
export class FinancialStatementsInaoService {
  constructor(private dataverseClient: FinancialStatementsInaoClientService) {}

  async getClientTypes() {
    return this.dataverseClient.getClientTypes()
  }

  async getUserClientType(nationalId: string) {
    if (kennitala.isPerson(nationalId)) {
      return this.dataverseClient.getClientType('individual')
    } else {
      return this.dataverseClient.getUserClientType(nationalId)
    }
  }

  async getElections() {
    return this.dataverseClient.getElections()
  }
}
