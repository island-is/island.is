import { FinancialStatementsInaoClientService } from '@island.is/clients/financial-statements-inao'
import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

@Injectable()
export class FinancialStatementCemeteryService {
  constructor(private dataverseClient: FinancialStatementsInaoClientService) {}

  async getClientTypes() {
    return this.dataverseClient.getClientTypes()
  }

  async getUserClientType(nationalId: string) {
    if (kennitala.isPerson(nationalId)) {
      return this.dataverseClient.getClientType('Einstaklingur')
    } else {
      return this.dataverseClient.getUserClientType(nationalId)
    }
  }

  async getClientFinancialLimit(clientType: string, year: string) {
    return this.dataverseClient.getClientFinancialLimit(clientType, year)
  }

  async getConfig() {
    return this.dataverseClient.getConfig()
  }

  async getTaxInformation(nationalId: string, year: string) {
    return this.dataverseClient.getTaxInformationValues(nationalId, year)
  }
}
