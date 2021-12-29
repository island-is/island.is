import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { CertificateInfoResponse } from '../types/schema'

export class DoctorsNoteProvider extends BasicDataProvider {
  type = 'DoctorsNoteProvider'

  async provide(): Promise<CertificateInfoResponse> {
    //TODO
    const query = `
      query getSyslumennCertificateInfo {
        getSyslumennCertificateInfo {
          nationalId
          expirationDate
          releaseDate
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(response.data.getSyslumennCertificateInfo)
      })
      .catch((error) => this.handleError(error))
  }

  handleError(error: any) {
    console.log('Provider error - DoctorsNoteProvider:', error)
    return Promise.reject({ errors: error })
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
