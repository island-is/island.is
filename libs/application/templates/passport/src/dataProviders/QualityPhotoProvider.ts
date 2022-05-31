import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  coreErrorMessages,
} from '@island.is/application/core'
import { HasQualityPhotoProvider } from '@island.is/application/data-providers'

export class QualityPhotoProvider extends HasQualityPhotoProvider {
  type = 'QualityPhotoProvider'

  async provide() {
    return await this.getHasQualityPhoto()
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
