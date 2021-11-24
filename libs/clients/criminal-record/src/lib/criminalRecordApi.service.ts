import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'
import { CrimeCertificateApi } from '../../gen/fetch'

@Injectable()
export class CriminalRecordApi {
  constructor(private readonly api: CrimeCertificateApi) {}

  public async getCriminalRecord(ssn: string): Promise<CriminalRecord> {
    console.log('---------------- CriminalRecordApi.getCriminalRecord ' + ssn + ' ----------------');

    const blob = await this.api.apiPdfCreatePersonIdGet({ personId: ssn })
    const blobText = await blob.arrayBuffer()
    const blobTextBase64 = Buffer.from(blobText).toString('base64')

    const record: CriminalRecord = {
      pdfBase64: blobTextBase64
    }

    return record
  }

  public async checkCriminalRecord(ssn: string): Promise<Boolean> {
    console.log('---------------- CriminalRecordApi.checkCriminalRecord ----------------');
    
    const record = await this.getCriminalRecord(ssn)

    return record.pdfBase64.length > 0
  }
}
