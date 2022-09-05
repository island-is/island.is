import {  NationalRegistryPerson } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { MarriageConditionsFakeData, YES } from '../types'
import { genderedMaritalStatuses } from '../lib/constants'

export interface MaritalStatusProvider {
  maritalStatus: string
}
const ALLOWED_MARITAL_STATUSES = ['1', '5', '4']
const ALLOWED_GENDER_CODE = ['1', '2', '7']
export class NationalRegistryMaritalStatusProvider extends BasicDataProvider {
  type = 'NationalRegistryMaritalStatusProvider'

  async provide(application: Application): Promise<MaritalStatusProvider> {
    const fakeData = getValueViaPath<MarriageConditionsFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    const query = `
    query NationalRegistryUserQuery {
      nationalRegistryUserV2 {
        genderCode
        spouse {
          name
          nationalId
          maritalStatus
        }
      }
    }
    `
    if (useFakeData) {
      return this.handleFakeData(fakeData)
    }

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

        const maritalStatus: string =
          nationalRegistryUser.spouse?.maritalStatus || ''
        const genderCode = nationalRegistryUser.genderCode || ''

        if (this.allowedCodes(maritalStatus, genderCode)) {
          return Promise.resolve({
            maritalStatus: this.formatMaritalStatus(maritalStatus, genderCode),
          })
        }
        return Promise.reject({
          reason: `Applicant marital status ${maritalStatus} not applicable`,
        })
      })
      .catch(() => {
        if (useFakeData) {
          return this.handleFakeData(fakeData)
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

  private formatMaritalStatus(maritalCode: string, genderCode: string): string {
    return genderedMaritalStatuses[maritalCode][genderCode]
  }

  private allowedCodes(maritalCode: string, genderCode: string): boolean {
    return (
      ALLOWED_MARITAL_STATUSES.includes(maritalCode) &&
      ALLOWED_GENDER_CODE.includes(genderCode)
    )
  }

  private handleFakeData(fakeData?: MarriageConditionsFakeData) {
    const maritalStatus: string = fakeData?.maritalStatus || ''
    const genderCode = fakeData?.genderCode || ''
    if (this.allowedCodes(maritalStatus, genderCode)) {
      return Promise.resolve({
        maritalStatus: this.formatMaritalStatus(maritalStatus, genderCode),
      })
    } else {
      return Promise.reject({
        reason: `Applicant marital status ${maritalStatus} not applicable`,
      })
    }
  }
}
