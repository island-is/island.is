import { Application, getValueViaPath } from '@island.is/application/core'
import { QUALITY_PHOTO } from './queries.graphql'
import { useQuery } from '@apollo/client'

export interface QualityPhotoType {
  qualityPhoto: string | null
  success: boolean
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

  const { data } = useQuery(QUALITY_PHOTO, {
    skip: !hasQualityPhoto?.data?.hasQualityPhoto,
  })

  if (hasQualityPhoto?.data?.hasQualityPhoto === false) {
    return {
      success: false,
      qualityPhoto: null,
    }
  }
  const qualityPhoto: QualityPhotoType = {
    success: data?.qualityPhoto?.success,
    qualityPhoto: data?.qualityPhoto?.qualityPhotoDataUri,
  }
  return qualityPhoto
}
