import { Injectable } from '@nestjs/common'
// import { 
//   CheckCriminalRecordObj
// } from './graphql/models/checkCriminalRecordObj.model';
import {
  CriminalRecordApi,
  CriminalRecord,
} from '@island.is/clients/criminal-record'

@Injectable()
export class CriminalRecordService {
  constructor(private readonly criminalRecordApi: CriminalRecordApi) {}

  async getCriminalRecord(): Promise<CriminalRecord> {
    return await this.criminalRecordApi.getCriminalRecord()
  }

  async checkCriminalRecord(): Promise<Boolean> {
    return await this.criminalRecordApi.checkCriminalRecord()
  }
}
