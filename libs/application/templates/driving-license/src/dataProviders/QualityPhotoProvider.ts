import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  coreErrorMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { HasQualityPhotoProvider } from '@island.is/application/data-providers'

const YES = 'yes'

export class QualityPhotoProvider extends HasQualityPhotoProvider {
  type = 'QualityPhotoProvider'

  async provide(application: Application) {
    // If running locally or on dev allow for fake data
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      application.answers,
      'fakeData.useFakeData',
    )
    // To use fake data for the quality photo provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
    if (useFakeData === YES) {
      const hasQualityPhoto = getValueViaPath<'yes' | 'no'>(
        application.answers,
        'fakeData.qualityPhoto',
      )
      return {
        hasQualityPhoto: hasQualityPhoto === YES,
      }
    }

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
