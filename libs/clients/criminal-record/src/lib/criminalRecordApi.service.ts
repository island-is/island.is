import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'

@Injectable()
export class CriminalRecordApi {
  constructor() {}

  public async getCriminalRecord(): Promise<CriminalRecord> {
    //TODO get criminal record from API or from some temp storage (if not older than 1 hour)
    const record = <CriminalRecord>{
      ssn: 'abc'
    }

    return record
  }

  public async checkCriminalRecord(): Promise<Boolean> {
    const record = this.getCriminalRecord()
    
    //TODO save criminalRecord in some storage

    // return true if no error was caught
    return true
  }
}
