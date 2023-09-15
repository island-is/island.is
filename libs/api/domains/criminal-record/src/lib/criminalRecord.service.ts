import { Injectable } from '@nestjs/common'
import {
  CriminalRecordApi,
  CriminalRecord,
} from '@island.is/clients/criminal-record'

@Injectable()
export class CriminalRecordService {
  constructor(private readonly criminalRecordApi: CriminalRecordApi) {}

  async getCriminalRecord(ssn: string): Promise<CriminalRecord> {
    return await this.criminalRecordApi.getCriminalRecord(ssn)
  }

  async validateCriminalRecord(ssn: string): Promise<boolean> {
    return await this.criminalRecordApi.validateCriminalRecord(ssn)
  }
}
