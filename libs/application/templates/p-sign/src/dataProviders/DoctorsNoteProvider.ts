import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class DoctorsNoteProvider extends BasicDataProvider {
  type = 'DoctorsNoteProvider'

  async provide() {
    //TODO
    /*const query = `
      query getSyslumennCertificateInfo ($input: CertificateInfoInput!) {
        getSyslumennCertificateInfo (input: $input) {
          nationalId
          expirationDate
          releaseDate
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError()
        }

        return Promise.resolve(response.data.drivingLicenseListOfJuristictions)
      })
      .catch(() => {
        return this.handleError()
      })*/

    return Promise.resolve({ expirationDate: '2025-12-21T14:28:20.747Z' })
  }

  handleError() {
    return Promise.resolve({})
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
