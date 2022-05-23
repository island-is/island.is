import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { DataverseClient } from './client/dataverseClient'

@Injectable()
export class FinancialStatementsInaoService {
  constructor(private dataverseClient: DataverseClient) {}

  async getUserClientType(nationalId: string) {
    if (kennitala.isPerson(nationalId)) {
      return { code: 'individual', name: 'Einstaklingur' }
    } else {
      return this.dataverseClient.getUserClientType(nationalId)
    }
  }

  async getElections() {
    return this.dataverseClient.getElections()
  }

  async getClientTypes() {
    return this.dataverseClient.getClientTypes()
  }
}
