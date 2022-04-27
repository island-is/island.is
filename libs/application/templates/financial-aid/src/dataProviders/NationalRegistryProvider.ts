import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import {
  DirectTaxPayment,
  Municipality,
  PersonalTaxReturn,
} from '@island.is/financial-aid/shared/lib'
import { DataProviderTypes, Applicant, TaxData } from '../lib/types'

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
const personalTaxReturnQuery = `
query PersonalTaxReturnQuery($input: MunicipalitiesFinancialAidPersonalTaxReturnInput!) {
  municipalitiesPersonalTaxReturn(input: $input) {
      personalTaxReturn {
        key
        name
        size
      }
    }
  }
`

const directTaxPaymentsQuery = `
  query DirectTaxPaymentsQuery {
    municipalitiesDirectTaxPayments {
      success
      directTaxPayments {
        totalSalary
        payerNationalId
        personalAllowance
        withheldAtSource
        month
        year
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

  async provide(
    application: Application,
  ): Promise<{
    applicant: Applicant
    municipality: Municipality
    taxData: TaxData
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

    const personalTaxReturn = await this.runQuery<{
      personalTaxReturn: PersonalTaxReturn | null
    }>(personalTaxReturnQuery, 'municipalitiesPersonalTaxReturn', {
      input: { id: application.id },
    })

    const directTaxPayments = await this.runQuery<{
      directTaxPayments: DirectTaxPayment[]
      success: boolean
    }>(directTaxPaymentsQuery, 'municipalitiesDirectTaxPayments')

    const taxData = {
      municipalitiesPersonalTaxReturn: personalTaxReturn,
      municipalitiesDirectTaxPayments: directTaxPayments,
    }

    return { applicant, municipality, taxData }
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
