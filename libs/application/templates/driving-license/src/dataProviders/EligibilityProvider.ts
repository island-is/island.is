import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { DrivingLicenseFakeData, YES } from '../lib/constants'
import { ApplicationEligibility, RequirementKey } from '../types/schema'

export class EligibilityProvider extends BasicDataProvider {
  type = 'EligibilityProvider'

  async provide(application: Application): Promise<ApplicationEligibility> {
    const fakeData = application.answers.fakeData as DrivingLicenseFakeData | undefined

    if (fakeData?.useFakeData === YES) {
      return {
        isEligible: true,
        requirements: [
          {
            key: RequirementKey.DrivingAssessmentMissing,
            requirementMet: true,
          },
          {
            key: RequirementKey.DrivingSchoolMissing,
            requirementMet: true,
          },
          {
            key: RequirementKey.DeniedByService,
            requirementMet: true,
          },
        ],
      }
    }

    const query = `
      query EligibilityQuery($drivingLicenseType: String!) {
        drivingLicenseApplicationEligibility(type: $drivingLicenseType) {
          isEligible
          requirements {
            key
            requirementMet
          }
        }
      }
    `

    const res = await this.useGraphqlGateway(query, { drivingLicenseType: 'B' })
    if (!res.ok) {
      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }
    const response = await res.json()

    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }

    return response.data.drivingLicenseApplicationEligibility
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
