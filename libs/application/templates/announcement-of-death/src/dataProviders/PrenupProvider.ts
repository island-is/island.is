import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Prenup } from '../types'
import { m } from '../lib/messages'

export class PrenupProvider extends BasicDataProvider {
  type = 'PrenupProvider'

  async provide(): Promise<Prenup> {
    // TODO implement from external client
    return Promise.resolve({
      nationalId: '1111111111',
      partnerNationalId: '1111111111',
      hasPrenup: true,
    })

    /*
    const query = `
      query GetPrenupQuery($input: GetPrenupInput!) {
        getPrenup(input: $input) {
        hasPrenup
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }
        const data = response.data.getPrenup
        const prenup: Prenup = {
          hasPrenup: data.hefurKaupmala
          nationalId: data.nationalId
          partnerNationalId: data.partnerNationalId ?? ""
        }

        return Promise.resolve(prenup)
      })
      .catch((error) => this.handleError(error))
    */
  }

  handleError(error: any) {
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
