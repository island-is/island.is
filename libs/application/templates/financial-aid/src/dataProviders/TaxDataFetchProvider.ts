import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import {
  DirectTaxPayment,
  PersonalTaxReturn,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import { DataProviderTypes, TaxData } from '../lib/types'

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
  query DirectTaxPaymentsQuery($input: MunicipalitiesGetDirectTaxPaymentsInput!) {
    municipalitiesDirectTaxPayments(input: $input) {
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

export class TaxDataFetchProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.TaxDataFetch

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

  async provide(application: Application): Promise<TaxData> {
    const personalTaxReturn = await this.runQuery<{
      personalTaxReturn: PersonalTaxReturn | null
    }>(personalTaxReturnQuery, 'municipalitiesPersonalTaxReturn', {
      input: { id: application.id },
    })

    const getUserType = application?.externalData?.taxDataFetch
      ? UserType.SPOUSE
      : UserType.APPLICANT

    const directTaxPayments = await this.runQuery<{
      directTaxPayments: DirectTaxPayment[]
      success: boolean
    }>(directTaxPaymentsQuery, 'municipalitiesDirectTaxPayments', {
      input: {
        userType: getUserType,
      },
    })

    return {
      municipalitiesPersonalTaxReturn: personalTaxReturn,
      municipalitiesDirectTaxPayments: directTaxPayments,
    }
  }
  handleError(error: Error | unknown) {
    return Promise.reject('Failed to fetch from tax data')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: TaxData): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
