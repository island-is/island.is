import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { TemporaryVoterRegistry } from '../types/schema'

export type TemporaryVoterRegistryVoterRegion = Pick<
  TemporaryVoterRegistry,
  'regionName' | 'regionNumber'
>
type TemporaryVoterRegistryResponse = {
  temporaryVoterRegistryGetVoterRegion: TemporaryVoterRegistryVoterRegion
}

export class CurrentUserCompaniesProvider extends BasicDataProvider {
  type = 'TemporaryVoterRegistry'

  async provide(): Promise<TemporaryVoterRegistryVoterRegion> {
    const query = `
      temporaryVoterRegistryGetVoterRegion {
        regionName
        regionNumber
      }
    `

    return this.useGraphqlGateway<TemporaryVoterRegistryResponse>(query).then(
      async (res) => {
        const response = await res.json()

        // service should always return data even when requested entry does not exist, this is here to flag missing data on critical failures
        if (!response.data) {
          throw new Error('Failed to get data')
        }

        return {
          regionName:
            response.data.temporaryVoterRegistryGetVoterRegion.regionName,
          regionNumber:
            response.data.temporaryVoterRegistryGetVoterRegion.regionNumber,
        }
      },
    )
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason:
        'Sambandi við vefþjónustu náðist ekki, vinsamlegast reynið aftur síðar',
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
