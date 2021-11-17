import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'

@Injectable()
export class CriminalRecordApi {
  constructor() {}

  public async getCriminalRecord(): Promise<CriminalRecord> {
    //TODO get criminal record from API
    const record = <CriminalRecord>{
      ssn: 'abc'
    }

    return record
  }
}
