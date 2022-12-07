import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { IdentityDocument } from '../lib/constants'
import { m } from '../lib/messages'

export class IdentityDocumentProvider extends BasicDataProvider {
  type = 'IdentityDocumentProvider'

  async provide(): Promise<IdentityDocument> {
    const query = `
      query getPassport {
        getPassport {
          productionRequestID
          number
          type
          verboseType
          subType
          status
          issuingDate
          expirationDate
          displayFirstName
          displayLastName
          mrzFirstName
          mrzLastName
          sex
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(response.data.getPassport)
      })
      .catch((error) => this.handleError(error))
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
