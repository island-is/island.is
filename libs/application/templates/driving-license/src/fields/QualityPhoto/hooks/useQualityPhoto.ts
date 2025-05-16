import { getValueViaPath, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { QUALITY_PHOTO } from './queries.graphql'
import { useQuery, ApolloError } from '@apollo/client'

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

const FAKE_QUALITY_PHOTO = {
  qualityPhoto: 'fake',
  loading: false,
  error: undefined,
}

const hasFakeQualityPhoto = (application: Application): boolean => {
  // If running locally or on dev allow for fake data
  const useFakeData = getValueViaPath<'yes' | 'no'>(
    application.answers,
    'fakeData.useFakeData',
  )
  // To use fake data for the quality photo provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
  if (useFakeData === YES) {
    const fakeQualityPhoto = getValueViaPath<'yes' | 'no'>(
      application.answers,
      'fakeData.qualityPhoto',
    )
    return fakeQualityPhoto === YES
  }
  return false
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
  const useFake = hasFakeQualityPhoto(application)

  return useFake ? FAKE_QUALITY_PHOTO : qualityPhoto
}
