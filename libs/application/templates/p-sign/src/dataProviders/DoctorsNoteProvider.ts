import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { CertificateInfoResponse } from '../types/schema'
import { m } from '../lib/messages'

export class DoctorsNoteProvider extends BasicDataProvider {
  type = 'DoctorsNoteProvider'

  async provide(): Promise<CertificateInfoResponse> {
    const query = `
      query getSyslumennCertificateInfo {
        getSyslumennCertificateInfo {
          nationalId
          expirationDate
          releaseDate
        }
      }
    `
    const res = await this.useGraphqlGateway(query)
    if (!res.ok) {
      console.error('[DoctorsNoteProvider]', await res.json())

      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }

    const response = await res.json()
    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }
    if (!response.data.getSyslumennCertificateInfo.expirationDate) {
      return Promise.reject({})
    }

    return Promise.resolve(response.data.getSyslumennCertificateInfo)
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
