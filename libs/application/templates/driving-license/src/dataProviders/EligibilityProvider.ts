import { RequirementKey } from '../types/schema'
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

const extractReason = (
  requirements: { requirementMet: boolean; key: string }[],
): string => {
  return requirements
    .filter(({ requirementMet }) => !requirementMet)
    .map(({ key }) => key)
    .map((key) => requirementKeyToMessageId(key))
    .join(', ')
}

// TODO: we need a better way of getting the translated string in here, outside
// of react. Possibly we should just make a more flexible results screen.
// This string ends up being used as the paramejter displayed as the error message
// for the failed dataprovider
const requirementKeyToMessageId = (key: string): StaticText => {
  switch (key) {
    case RequirementKey.DrivingSchoolMissing:
      return m.requirementUnmetDrivingSchool.defaultMessage
    case RequirementKey.DrivingAssessmentMissing:
      return m.requirementUnmetDrivingAssessment.defaultMessage
    case RequirementKey.DeniedByService:
      return m.requirementUnmetDeniedByService.defaultMessage
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}

export class EligibilityProvider extends BasicDataProvider {
  type = 'EligibilityProvider'

  async provide(application: Application): Promise<Boolean> {
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

    const response = await res.json()

    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }

    return response.data.drivingLicenseApplicationEligibility
  }

  onProvideError (): FailedDataProviderResult {
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
