import { BasicDataProvider } from '@island.is/application/types'

export type HasQualitySignature = {
  hasQualitySignature: boolean
}
export abstract class HasQualitySignatureProvider extends BasicDataProvider {
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
}
