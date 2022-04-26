import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/core'
import { DistrictCommissionerAgencies } from '../types/schema'
import { m } from '../lib/messages'
import { DeadRelative } from '../types/index'

export class DeathNoticeProvider extends BasicDataProvider {
  type = 'DeathNoticeProvider'

  async provide(application: Application): Promise<DeadRelative[]> {
    if (application.applicant !== '0101302399') {
      return Promise.reject({
        message: 'Engir dauðir ættingjar buddy',
      })
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data: DeadRelative[] = [
        {
          name: 'Jóna Bóna Beikon',
          nationalId: '0101301337',
        },
      ]

      return Promise.resolve(data)
    }
    /*
    const query = `
        query getDeathNotice {
          getDeathnotice{
            properties
            go
            here
          }
        }
      `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(
          response.data.whatever,
        )
      })
      .catch((error) => this.handleError(error))
  */
  }

  handleError(error: any) {
    return Promise.reject({})
  }

  onProvideError(result: { message: string }): FailedDataProviderResult {
    console.log('GAGGALAGOOGOOGAGA', result)
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
