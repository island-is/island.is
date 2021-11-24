import { Injectable } from '@nestjs/common'
import { CriminalRecord } from './criminalRecordApi.types'
import { CrimeCertificateApi } from '../../gen/fetch'

@Injectable()
export class CriminalRecordApi {
  constructor(private readonly api: CrimeCertificateApi) {}

  public async getCriminalRecord(): Promise<CriminalRecord> {
    console.log('---------------- CriminalRecordApi.getCriminalRecord ----------------');

    const blob = await this.api.apiPdfCreatePersonIdGet({ personId: '0101051450' })
    console.log('---------------- CriminalRecordApi.getCriminalRecord.blob.size: ' + blob.size + '----------------')
    //console.log('---------------- CriminalRecordApi.getCriminalRecord.blob.text: ' + blob.text() + '----------------')

    const record: CriminalRecord = {
      pdfBase64: await this.blobToBase64(blob)
      //pdfBlob: blob
    }

    return record
  }

  public async checkCriminalRecord(): Promise<Boolean> {
    console.log('---------------- CriminalRecordApi.checkCriminalRecord ----------------');
    
    const record = await this.getCriminalRecord()

    //TODO save criminalRecord in some storage

    return record.pdfBase64.length > 0
    //return record.pdfBlob.size > 0
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      //var FileReader = require('filereader');
      const reader = new FileReader();
      reader.onloadend = () => resolve(<string>reader.result);
      reader.readAsDataURL(blob);
    })
  }
}
