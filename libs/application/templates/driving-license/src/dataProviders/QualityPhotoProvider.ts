import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export class QualityPhotoProvider extends BasicDataProvider {
  type = 'QualityPhotoProvider'

  async provide() {
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
      qualityPhoto: response.data.qualityPhoto?.qualityPhoto,
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
