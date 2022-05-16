import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { HasTeachingRights } from '@island.is/api/schema'

export class TeachingRightsProvider extends BasicDataProvider {
  type = 'TeachingRightsProvider'

  async provide(): Promise<HasTeachingRights> {
    const query = `
      query DrivingLicenseTeachingRights {
        drivingLicenseTeachingRights {
          nationalId
          hasTeachingRights
        }
      }
    `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      if (!res.ok) {
        console.error('failed http request', { res })
        return Promise.reject({ reason: 'Náði ekki sambandi við vefþjónustu' })
      }

      const response = await res.json()

      if (response.errors) {
        console.error('response errors', { response })
        return Promise.reject({ reason: 'Þú hefur ekki ökukennararéttindi í ökuskírteinaskrá.' })
      }

      const drivingLicenseTeachingRights =
        response.data.drivingLicenseTeachingRights

      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve({})
      }

      if (drivingLicenseTeachingRights.hasTeachingRights) {
        return Promise.resolve(drivingLicenseTeachingRights)
      } else {
        return Promise.reject({
          reason: 'Þú hefur ekki ökukennararéttindi í ökuskírteinaskrá. Vinsamlega hafðu samband við næsta sýslumannsembætti ef þú telur um villu vera að ræða',
        })
      }
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

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
