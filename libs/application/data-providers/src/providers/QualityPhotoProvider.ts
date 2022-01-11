import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  coreErrorMessages,
} from '@island.is/application/core'

export class QualityPhotoProvider extends BasicDataProvider {
  type = 'QualityPhotoProvider'

  async provide(application: Application) {
    const query = `
        query HasQualityPhoto {
          qualityPhoto {
            hasQualityPhoto
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
    console.log(response)
    if (response.errors) {
      return Promise.reject({ error: response.errors })
    }

    return {
      hasQualityPhoto: !!response.data.qualityPhoto?.hasQualityPhoto,
    }
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
