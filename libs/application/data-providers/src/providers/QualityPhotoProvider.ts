import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  coreErrorMessages,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { DataProviderFakeData, YES } from '../libs/constants'

export class QualityPhotoProvider extends BasicDataProvider {
  type = 'QualityPhotoProvider'

  async provide(application: Application) {
    // If running locally or on dev allow for fake data
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      const fakeData = application.answers.fakeData as
        | DataProviderFakeData
        | undefined

      // To use fake data for the quality photo provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
      if (fakeData?.useFakeData === YES) {
        return {
          success: fakeData.qualityPhoto === YES,
          qualityPhoto:
            fakeData.qualityPhoto === YES
              ? `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIAAIAAgMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAH/9oACAEBAAAAAHP/xAAUAQEAAAAAAAAAAAAAAAAAAAAH/9oACAECEAAAADv/xAAUAQEAAAAAAAAAAAAAAAAAAAAG/9oACAEDEAAAAHn/xAAZEAABBQAAAAAAAAAAAAAAAAAAAgMTU5H/2gAIAQEAAT8AjbrTh//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z`
              : null,
        }
      }
    }

    const query = `
        query HasQualityPhoto {
          qualityPhoto {
            success
            qualityPhoto
          }
        }
      `

    const res = await this.useGraphqlGateway(query)

    if (!res.ok) {
      return Promise.reject({
        reason: 'Náði ekki sambandi við vefþjónustu',
      })
    }

    const response = await res.json()

    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }

    return {
      success: !!response.data.qualityPhoto?.success,
      qualityPhoto: this.toDataUri(response.data.qualityPhoto?.qualityPhoto),
    }
  }

  toDataUri(qualityPhoto?: string) {
    if (!qualityPhoto) {
      return null
    }

    // TODO: Not sure why we need to do this - was in the UI but doesnt match normal base64 encoded jpegs
    return `data:image/jpeg;base64,${qualityPhoto.substr(
      1,
      qualityPhoto.length - 2,
    )}`
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
