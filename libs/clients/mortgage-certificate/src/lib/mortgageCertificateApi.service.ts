import { Injectable } from '@nestjs/common'
import { MortgageCertificate } from './mortgageCertificateApi.types'
// TODOx mortgateApi
// import { CrimeCertificateApi } from '../../gen/fetch'

@Injectable()
export class MortgageCertificateApi {
  constructor(/*private readonly api: CrimeCertificateApi*/) {}

  public async getMortgageCertificate(
    ssn: string,
  ): Promise<MortgageCertificate> {
    // const contentBlob = await this.api.apiPdfV1CreatePersonalPersonIdGet({
    //   personId: ssn,
    // })
    // const contentArrayBuffer = await contentBlob.arrayBuffer()
    // const contentBase64 = Buffer.from(contentArrayBuffer).toString('base64')

    // const record: MortgageCertificate = {
    //   contentBase64: contentBase64,
    // }
    const record: MortgageCertificate = {
      contentBase64: 'TODO',
    }

    return record
  }

  public async validateMortgageCertificate(ssn: string): Promise<Boolean> {
    // Note: this function will throw an error if something goes wrong
    const record = await this.getMortgageCertificate(ssn)

    return record.contentBase64.length !== 0
  }
}
