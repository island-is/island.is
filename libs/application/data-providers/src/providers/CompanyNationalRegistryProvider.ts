import { coreErrorMessages } from '@island.is/application/core'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { NationalRegistryUser, RskCompany } from '@island.is/api/schema'
import { promise } from 'zod'

export class CompanyNationalRegistryProvider extends BasicDataProvider {
  type = 'CompanyNationalRegistryProvider'

  async provide(
    _application: Application,
  ): Promise<RskCompany | NationalRegistryUser> {
    const query = `
      query CompanyNationalRegistryQuery {

        companyRegistryCurrentCompany{
          nationalId,
          name,
          companyInfo{
              address{
                  streetAddress, 
                  postalCode,
                  locality,
                  country,
                  municipalityNumber
                }
            }
        }

        nationalRegistryUser {
            nationalId
            age
            fullName
            citizenship {
              code
              name
            }
            legalResidence
            address {
              code
              postalCode
              city
              streetAddress
              lastUpdated
            }
          }
          
      }
    `
    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      // We can't use "if response on errors" here because returning an error for one of the queries is expected.

      if (response.data?.companyRegistryCurrentCompany) {
        return Promise.resolve(response.data.companyRegistryCurrentCompany)
      }
      return Promise.resolve(response.data.nationalRegistryUser)
    })
  }

  onProvideError(_result: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: coreErrorMessages.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
