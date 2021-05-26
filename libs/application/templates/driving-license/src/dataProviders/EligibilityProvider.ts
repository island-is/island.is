import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { m } from '../lib/messages'

const extractReason = (
  requirements: { key: string, requirementMet: boolean }[],
): string => {
  return requirements
    .filter(({ requirementMet }) => !requirementMet)
    .map(({ key }) => key)
    .map((key) => requirementKeyToMessage(key))
    .join(', ')
}

// TODO find a way to use the same type
export enum RequirementKey {
  drivingAssessmentMissing = 'DrivingAssessmentMissing',
  drivingSchoolMissing = 'DrivingSchoolMissing',
  deniedByService = 'DeniedByService',
}

const requirementKeyToMessage = (key: string) => {
  switch (key) {
    case 'drivingSchoolMissing':
      return m.requirementUnmetDrivingSchool
    case 'drivingAssessmentMissing':
      return m.requirementUnmetDrivingAssessment
    case '':
      return m.requirementUnmetDeniedByService
    default:
      return ''
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

    return this.useGraphqlGateway(query, { drivingLicenseType: 'B' }).then(
      async (res: Response) => {
        if (!res.ok) {
          console.error('failed http request', { res })
          return Promise.reject({
            reason: 'Náði ekki sambandi við vefþjónustu',
          })
        }

        const response = await res.json()

        if (response.errors) {
          console.error('response errors', { response })
          return Promise.reject({ reason: 'Ekki tókst að sækja gögn' })
        }

        const eligibility = response.data.drivingLicenseApplicationEligibility

        if (eligibility.isEligible) {
          return Promise.resolve(eligibility.isEligible)
        } else {
          return Promise.reject({
            reason: extractReason(eligibility.requirements),
          })
        }
      },
    )
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
}
