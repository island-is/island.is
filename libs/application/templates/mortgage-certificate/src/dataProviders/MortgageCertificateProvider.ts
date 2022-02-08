//TODOx á þetta að vera í provider? á að tjékka eftir að það er búið að velja fasteign en áður en þú borgar

import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class MortgageCertificateProvider extends BasicDataProvider {
  type = 'MortgageCertificateProvider'

  async provide(): Promise<unknown> {
    const query = `
    query GetMortgageCertificateValidation($realEstateNumberInput: String!) {
        mortgageCertificateValidation(realEstateNumber: $realEstateNumberInput)
      }
    `

    return this.useGraphqlGateway(query, {
      realEstateNumberInput: 'TODOx',
    }).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      if (response.data.mortgageCertificateValidation !== true) {
        return Promise.reject({})
      }

      return Promise.resolve({ isValid: true })
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

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
