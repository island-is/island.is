import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { DataProviderTypes, Applicant } from '../lib/types'

const nationalRegistryQuery = `
query NationalRegistryUserQuery {
  nationalRegistryUserV2 {
    nationalId
    fullName
    address {
      streetName
      postalCode
      city
      municipalityCode
    }
    spouse {
      nationalId
      maritalStatus
      name
    }
  }
}
`

const municipalityQuery = `
  query MunicipalitiesFinancialAidMunicipalityQuery($input: MunicipalitiesFinancialAidMunicipalityInput!) {
    municipalitiesFinancialAidMunicipality(input: $input) {
      id
      name
      homepage
      active
      municipalityId
      email
      rulesHomepage
      individualAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
    }
  }
`

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry

  async runQuery<T>(
    query: string,
    key: string,
    variables?: Record<string, { id: string }>,
  ): Promise<T> {
    return await this.useGraphqlGateway(query, variables)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data[key])
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  async provide(): Promise<{
    applicant: Applicant
    municipality: Municipality
  }> {
    const applicant = await this.runQuery<Applicant>(
      nationalRegistryQuery,
      'nationalRegistryUserV2',
    )

    const municipality = await this.runQuery<Municipality>(
      municipalityQuery,
      'municipalitiesFinancialAidMunicipality',
      {
        input: { id: applicant.address.municipalityCode },
      },
    )

    return { applicant, municipality }
  }
  handleError(error: Error | unknown) {
    console.error('Provider.FinancialAid.NationalRegistry:', error)
    return Promise.reject('Failed to fetch from national registry')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: Applicant): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
