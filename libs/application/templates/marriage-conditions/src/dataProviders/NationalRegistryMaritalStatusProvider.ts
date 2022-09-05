import {
  MaritalStatus,
  NationalRegistryPerson,
  NationalRegistryBirthplace,
} from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { MarriageConditionsFakeData, YES } from '../types'

export class NationalRegistryMaritalStatusProvider extends BasicDataProvider {
  type = 'NationalRegistryMaritalStatusProvider'

  async provide(application: Application): Promise<any> {
    const fakeData = getValueViaPath<MarriageConditionsFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    const ALLOWED_MARITAL_STATUSES = [
      MaritalStatus.Unmarried,
      MaritalStatus.Divorced,
      MaritalStatus.Widowed,
    ]
    const query = `
    query NationalRegistryUserQuery {
      nationalRegistryUserV2 {
     
        spouse {
          name
          nationalId
          maritalStatus
        }
      
      }
    }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors && !useFakeData) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return Promise.reject({
            reason: `graphql error in ${this.type}: ${response.errors[0].message}`,
          })
        }
        const nationalRegistryUser: NationalRegistryPerson =
          response.data.nationalRegistryUser
        console.log(
          'HALLOOO',
          JSON.stringify(nationalRegistryUser),
          'use fake',
          useFakeData,
        )
        const maritalStatus: MaritalStatus = this.formatMaritalStatus(
          useFakeData
            ? nationalRegistryUser.spouse?.maritalStatus || ''
            : fakeData?.maritalStatus || '',
        )

        if (ALLOWED_MARITAL_STATUSES.includes(maritalStatus)) {
          console.log('YES')
          return Promise.resolve({ maritalStatus: maritalStatus })
        }
        console.log('NO?')
        return Promise.reject({
          reason: `Applicant marital status ${maritalStatus} not applicable`,
        })
      })
      .catch(() => {
        console.log('WHY')
        if (useFakeData) {
          console.log('WHY 2')
          return Promise.resolve({
            maritalStatus: fakeData?.maritalStatus || '',
          })
        }
        return Promise.reject({})
      })
  }

  onProvideError({ reason }: { reason: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: reason,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }

  private formatMaritalStatus(maritalCode: string): MaritalStatus {
    switch (maritalCode) {
      case '1':
        return MaritalStatus.Unmarried
      case '3':
        return MaritalStatus.Married
      case '4':
        return MaritalStatus.Widowed
      case '5':
        return MaritalStatus.Separated
      case '6':
        return MaritalStatus.Divorced
      case '7':
        return MaritalStatus.MarriedLivingSeparately
      case '8':
        return MaritalStatus.MarriedToForeignLawPerson
      case '9':
        return MaritalStatus.Unknown
      case '0':
        return MaritalStatus.ForeignResidenceMarriedToUnregisteredPerson
      case 'L':
        return MaritalStatus.IcelandicResidenceMarriedToUnregisteredPerson
      default:
        return MaritalStatus.Unmarried
    }
  }

  private handleMaritalStatus(maritalCode: string): Promise<any> {
    const maritalStatus = this.formatMaritalStatus(maritalCode)
    if (
      [
        MaritalStatus.Unmarried,
        MaritalStatus.Divorced,
        MaritalStatus.Widowed,
      ].includes(maritalStatus)
    ) {
      return Promise.resolve({
        maritalStatus,
      })
    }
    return Promise.reject({
      reason: `Applicant marital status ${maritalStatus} not applicable`,
    })
  }
}
