import { coreErrorMessages } from '@island.is/application/core'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { HasQualitySignatureProvider } from '@island.is/application/data-providers'

export class QualitySignatureProvider extends HasQualitySignatureProvider {
  type = 'QualitySignatureProvider'

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
