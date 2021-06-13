import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  formatText,
  StaticText,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { MessageDescriptor } from '@formatjs/intl'
import { RequirementKey } from '../types/schema'
import { ApplicationEligibilityRequirement } from '@island.is/api/schema'

export class EligibilityProvider extends BasicDataProvider {
  type = 'EligibilityProvider'

  async provide(
    application: Application,
  ): Promise<ApplicationEligibilityRequirement> {
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
      console.error('failed http request', { res })

      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }

    //     const eligibility = response.data.drivingLicenseApplicationEligibility
    //     // REMOVE || true - ONLY FOR TESTING PURPOSES.
    //     if (eligibility.isEligible || true) {
    //       return Promise.resolve(eligibility.isEligible)
    //     } else {
    //       return Promise.reject({
    //         reason: extractReason(eligibility.requirements),
    //       })
    //     }
    //   },
    // )
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
