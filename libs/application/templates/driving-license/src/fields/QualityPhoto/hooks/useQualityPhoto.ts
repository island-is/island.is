import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { QUALITY_PHOTO, QUALITY_SIGNATURE } from './queries.graphql'
import { useQuery, ApolloError } from '@apollo/client'

export interface PhotoType {
  data: string | null
  loading: boolean
  error: ApolloError | undefined
  fake?: boolean
}

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

const YES = 'yes'

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

export const useQualityPhoto = (
  application: Application,
): {
  qualityPhoto: PhotoType
  qualitySignature: PhotoType
} => {
  const hasQualityPhoto = getValueViaPath<HasQualityPhotoData>(
    application.externalData,
    'qualityPhoto',
  )

  const {
    data: photoData,
    loading: photoLoading,
    error: photoError,
  } = useQuery(QUALITY_PHOTO, {
    skip: !hasQualityPhoto?.data?.hasQualityPhoto,
  })

  const {
    data: signatureData,
    loading: signatureLoading,
    error: signatureError,
  } = useQuery(QUALITY_SIGNATURE, {
    skip: !hasQualityPhoto?.data?.hasQualityPhoto,
  })

  const useFake = hasFakeQualityPhoto(application)

  const qualityPhoto: PhotoType = {
    data: photoData?.drivingLicenseQualityPhoto?.dataUri,
    loading: photoLoading,
    error: photoError,
    fake: useFake,
  }

  const qualitySignature: PhotoType = {
    data: signatureData?.drivingLicenseQualitySignature?.dataUri,
    loading: signatureLoading,
    error: signatureError,
    fake: useFake,
  }

  return {
    qualityPhoto,
    qualitySignature,
  }
}
