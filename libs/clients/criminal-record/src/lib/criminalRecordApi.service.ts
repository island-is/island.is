import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'
import { CrimeCertificateApi } from '../../gen/fetch'

@Injectable()
export class CriminalRecordApi {
  constructor(private readonly api: CrimeCertificateApi) {}

  public async getCriminalRecord(): Promise<CriminalRecord> {
    console.log('---------------- CriminalRecordApi.getCriminalRecord ----------------');
    //TODO get criminal record from API or from some temp storage (if not older than 1 hour)
    const record = <CriminalRecord>{
      ssn: 'abc'
    }

    var result = await this.api.apiPdfCreatePersonIdGet({ personId: '0101051450' })
    console.log('---------------- CriminalRecordApi.getCriminalRecord.result: ' + JSON.stringify(result) + '----------------')

    return record
  }

  public async checkCriminalRecord(): Promise<Boolean> {
    console.log('---------------- CriminalRecordApi.checkCriminalRecord ----------------');
    const record = await this.getCriminalRecord()
    
    //TODO save criminalRecord in some storage

    // return true if no error was caught
    return true
  }
}
