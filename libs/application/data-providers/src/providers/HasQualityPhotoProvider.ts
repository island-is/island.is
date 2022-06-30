import { BasicDataProvider } from '@island.is/application/core'

export type HasQualityPhoto = {
  hasQualityPhoto: boolean
}
export abstract class HasQualityPhotoProvider extends BasicDataProvider {
  async getHasQualityPhoto(): Promise<HasQualityPhoto> {
    const query = `
        query HasQualityPhoto {
          drivingLicenseQualityPhoto {
            hasQualityPhoto
          }
        }
      `

    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return {
          hasQualityPhoto: false,
        }
      }

      return {
        hasQualityPhoto: !!response.data.drivingLicenseQualityPhoto
          ?.hasQualityPhoto,
      }
    })
  }
}
