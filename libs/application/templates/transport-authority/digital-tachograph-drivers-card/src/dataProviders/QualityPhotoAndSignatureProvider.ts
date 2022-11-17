import { QualityPhotoAndSignature } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { GET_QUALITY_PHOTO_AND_SIGNATURE } from '../graphql/queries'
import { externalData } from '../lib/messages'

export class QualityPhotoAndSignatureProvider extends BasicDataProvider {
  type = 'QualityPhotoAndSignatureProvider'

  async provide(): Promise<QualityPhotoAndSignature> {
    return this.useGraphqlGateway(GET_QUALITY_PHOTO_AND_SIGNATURE).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return Promise.reject({
            reason: `graphql error in ${this.type}: ${response.errors[0].message}`,
          })
        }

        const data = response.data as {
          digitalTachographQualityPhotoAndSignature: QualityPhotoAndSignature | null
        }
        const photoAndSignatureData =
          data?.digitalTachographQualityPhotoAndSignature

        // Make sure user has quality photo and signature (from either RLS or SGS),
        // if not then user cannot continue (will allow upload in phase 2)
        if (
          !photoAndSignatureData?.hasPhoto ||
          !photoAndSignatureData?.hasSignature
        ) {
          return Promise.reject({
            reason:
              externalData.qualityPhotoAndSignature.missing.defaultMessage,
          })
        }

        return Promise.resolve(photoAndSignatureData)
      },
    )
    // .catch(() => {
    //   return Promise.reject({})
    // })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
