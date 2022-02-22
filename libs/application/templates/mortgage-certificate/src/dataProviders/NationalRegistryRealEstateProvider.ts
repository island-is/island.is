import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { PropertyOverviewWithDetail } from '../types/schema'

export class NationalRegistryRealEstateProvider extends BasicDataProvider {
  readonly type = 'NationalRegistryRealEstate'

  async provide(): Promise<PropertyOverviewWithDetail> {
    const query = `
      query GetRealEstateQuery($input: GetMultiPropertyInput!) {
        assetsOverviewWithDetail(input: $input) {
          properties {
            propertyNumber
            defaultAddress {
              locationNumber
              postNumber
              municipality
              propertyNumber
              display
              displayShort
            }
            appraisal {
              activeAppraisal
              plannedAppraisal
              activeStructureAppraisal
              plannedStructureAppraisal
              activePlotAssessment
              plannedPlotAssessment
              activeYear
              plannedYear
            }
            registeredOwners {
              registeredOwners {
                name
                ssn
                ownership
                purchaseDate
                grantDisplay
              }
            }
            unitsOfUse {
              unitsOfUse {
                propertyNumber
                unitOfUseNumber
                marking
                usageDisplay
                displaySize
                buildYearDisplay
                fireAssessment
                explanation
                appraisal {
                  activeAppraisal
                  plannedAppraisal
                  activeStructureAppraisal
                  plannedStructureAppraisal
                  activePlotAssessment
                  plannedPlotAssessment
                  activeYear
                  plannedYear
                }
                address {
                  locationNumber
                  postNumber
                  municipality
                  propertyNumber
                  display
                  displayShort
                }
              }
            }
          }
        }
      }
    `
    return this.useGraphqlGateway<PropertyOverviewWithDetail>(query, {
      input: { cursor: '1' },
    })
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        return Promise.resolve({
          ...response.data.assetsOverviewWithDetail,
        })
      })
      .catch((error) => {
        return this.handleError()
      })
  }
  handleError() {
    return Promise.reject({})
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
      data: result,
    }
  }
  onProvideSuccess(
    result: PropertyOverviewWithDetail,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
