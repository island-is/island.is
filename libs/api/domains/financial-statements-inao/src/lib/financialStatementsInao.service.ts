import { Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { DataverseClient } from './client/dataverseClient'

@Injectable()
export class FinancialStatementsInaoService {
  constructor(private dataverseClient: DataverseClient) {}

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
