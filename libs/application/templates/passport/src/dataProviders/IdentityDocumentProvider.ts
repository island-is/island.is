import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
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
    console.log('MEOOOOOWWWWW!')

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

        console.log('RESPONSE IS HERE MAMIIIII', response)

        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(response.data.getIdentityDocument)
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
