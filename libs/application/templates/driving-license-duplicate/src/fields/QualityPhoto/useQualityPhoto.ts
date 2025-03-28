import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useQuery, ApolloError } from '@apollo/client'
import { gql } from '@apollo/client'

export const QUALITY_PHOTO = gql`
  query HasQualityPhoto {
    drivingLicenseQualityPhoto {
      dataUri
    }
  }
`

export interface QualityPhotoType {
  qualityPhoto: string | null
  loading: boolean
  error: ApolloError | undefined
}

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

export const useQualityPhoto = (application: Application): QualityPhotoType => {
  const hasQualityPhoto = getValueViaPath<HasQualityPhotoData>(
    application.externalData,
    'qualityPhoto',
  )
  const { data, loading, error } = useQuery(QUALITY_PHOTO, {
    skip: !hasQualityPhoto?.data?.hasQualityPhoto,
  })

  const qualityPhoto: QualityPhotoType = {
    qualityPhoto: data?.drivingLicenseQualityPhoto?.dataUri,
    loading: loading,
    error: error,
  }
  return qualityPhoto
}
