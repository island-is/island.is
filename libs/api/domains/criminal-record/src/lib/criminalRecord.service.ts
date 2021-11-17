import { Injectable } from '@nestjs/common'
// import { 
//   CheckCriminalRecordObj
// } from './graphql/models/checkCriminalRecordObj.model';
import {
  CriminalRecordApi,
} from '@island.is/clients/criminal-record'

@Injectable()
export class CriminalRecordService {
  constructor(private readonly criminalRecordApi: CriminalRecordApi) {}

  async checkCriminalRecord(): Promise<Boolean> {
    const criminalRecord = await this.criminalRecordApi.getCriminalRecord()

    //TODO save criminalRecord in some storage

    // return true if no error was caught
    return true
  }
}
