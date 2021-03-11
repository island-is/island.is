import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { CurrentUserCompanies } from '@island.is/api/schema'

export type UserCompany = Pick<
  CurrentUserCompanies,
  'kennitala' | 'nafn' | 'erProkuruhafi'
>
type GetUserCompaniesResponse = {
  rskGetCurrentUserCompanies: UserCompany[]
}

export class CurrentUserCompaniesProvider extends BasicDataProvider {
  type = 'PenaltyPointsProvider'

  async provide(): Promise<UserCompany[]> {
    const query = `
      query GetUserCompanies {
        rskGetCurrentUserCompanies {
          Kennitala
          Nafn
          ErProkuruhafi
        }
      }
    `

    // getting this info is not crucial for completion of this process so we return empty array on non critical errors
    return this.useGraphqlGateway<GetUserCompaniesResponse>(query).then(
      async (res) => {
        const response = await res.json()

        const uniqueAllowedCompanies = new Map<string, UserCompany>()
        const userCompanies = response.data?.rskGetCurrentUserCompanies ?? []
        userCompanies.forEach((company) => {
          // only add companies that this user does not have procurement for
          if (company.erProkuruhafi === '1') {
            uniqueAllowedCompanies.set(company.kennitala, company)
          }
        })

        return Promise.resolve(Array.from(uniqueAllowedCompanies.values()))
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
