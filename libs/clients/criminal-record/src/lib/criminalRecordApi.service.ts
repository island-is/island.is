import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'
import { CrimeCertificateApi } from '../../gen/fetch'

@Injectable()
export class CriminalRecordApi {
  constructor(private readonly api: CrimeCertificateApi) {}

  public async getCriminalRecord(ssn: string): Promise<CriminalRecord> {
    const contentBlob = await this.api.apiPdfV1CreatePersonalPersonIdGet({
      personId: ssn,
    })
    const contentArrayBuffer = await contentBlob.arrayBuffer()
    const contentBase64 = Buffer.from(contentArrayBuffer).toString('base64')

    const record: CriminalRecord = {
      contentBase64: contentBase64,
    }

    return record
  }

  public async validateCriminalRecord(ssn: string): Promise<boolean> {
    // Note: this function will throw an error if something goes wrong
    const record = await this.getCriminalRecord(ssn)

    return record.contentBase64.length !== 0
  }
}
