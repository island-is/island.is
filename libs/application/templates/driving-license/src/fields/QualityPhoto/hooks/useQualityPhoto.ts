import { Application, getValueViaPath } from '@island.is/application/core'
import { QUALITY_PHOTO } from './queries.graphql'
import { useQuery, ApolloError } from '@apollo/client'
import { YES } from '../../../lib/constants'

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
    const qualityPhoto: QualityPhotoType = {
      qualityPhoto:
        fakeQualityPhoto === YES
          ? `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIAAIAAgMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAH/9oACAEBAAAAAHP/xAAUAQEAAAAAAAAAAAAAAAAAAAAH/9oACAECEAAAADv/xAAUAQEAAAAAAAAAAAAAAAAAAAAG/9oACAEDEAAAAHn/xAAZEAABBQAAAAAAAAAAAAAAAAAAAgMTU5H/2gAIAQEAAT8AjbrTh//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z`
          : null,
      loading: false,
      error: undefined,
    }
    return qualityPhoto
  }

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
