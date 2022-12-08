import { coreErrorMessages } from '@island.is/application/core'
import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'

export type HasQualitySignature = {
  hasQualitySignature: boolean
}
export class QualitySignatureProvider extends BasicDataProvider {
  type = 'QualitySignatureProvider'
  async getHasQualitySignature(): Promise<HasQualitySignature> {
    const query = `
        query HasQualitySignature {
          drivingLicenseQualitySignature {
            hasQualitySignature
          }
        }
      `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return {
          hasQualitySignature: false,
        }
      }

      return {
        hasQualitySignature: !!response.data.drivingLicenseQualitySignature
          ?.hasQualitySignature,
      }
    })
  }

  async provide() {
    return await this.getHasQualitySignature()
  }

  onProvideError(): FailedDataProviderResult {
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
