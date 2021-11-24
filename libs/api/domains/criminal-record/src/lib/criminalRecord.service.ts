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

  async checkCriminalRecord(ssn: string): Promise<Boolean> {
    return await this.criminalRecordApi.checkCriminalRecord(ssn)
  }
}
