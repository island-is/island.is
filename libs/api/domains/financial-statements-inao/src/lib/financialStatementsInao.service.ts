import { Injectable } from '@nestjs/common'
import { DataverseClient } from './client/dataverseClient'

@Injectable()
export class FinancialStatementsInaoService {
  constructor(private dataverseClient: DataverseClient) {}

  async getElections() {
    return this.dataverseClient.getElections()
  }

  async getClientTypes() {
    return this.dataverseClient.getClientTypes()
  }
}
