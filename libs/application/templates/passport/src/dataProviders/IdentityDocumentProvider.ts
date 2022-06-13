import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export interface IdentityDocument {
  productionRequestID: string
  number: string
  type: string
  verboseType: string
  subType: string
  status: string
  issuingDate: Date
  expirationDate: Date
  displayFirstName: string
  displayLastName: string
  mrzFirstName: string
  mrzLastName: string
  sex: string
}

export class IdentityDocumentProvider extends BasicDataProvider {
  type = 'IdentityDocumentProvider'

  async provide(): Promise<IdentityDocument> {
    const response = {
      data: {
        getIdentityDocument: {
          productionRequestID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          number: 'A1234567',
          type: 'P',
          verboseType: 'Vegabréf: Almennt',
          subType: 'A',
          status: 'ISSUED',
          issuingDate: new Date('2012-10-02'),
          expirationDate: new Date('2022-10-02'),
          displayFirstName: 'Gervimaður',
          displayLastName: 'Mock',
          mrzFirstName: 'GERVIMAÐUR',
          mrzLastName: 'MOCK',
          sex: 'X',
        },
      },
    }

    return Promise.resolve(response.data.getIdentityDocument)
  }

  handleError(_error: any) {
    return Promise.reject({})
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
