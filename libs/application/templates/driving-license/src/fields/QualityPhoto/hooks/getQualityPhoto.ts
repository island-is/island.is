import { Application } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { QUALITY_PHOTO } from './queries.graphql'
import { useQuery } from '@apollo/client'

export interface QualityPhotoType {
  qualityPhoto: string | null
  success: boolean
}

const YES = 'yes'

type YesOrNo = 'yes' | 'no'

interface DataProviderFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
}

type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

export const getQualityPhoto = (application: Application): QualityPhotoType => {
  // If running locally or on dev allow for fake data
  if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
    const fakeData = application.answers.fakeData as
      | DataProviderFakeData
      | undefined

    // To use fake data for the quality photo provider take a look at the implementation in libs/application/templates/driving-license/src/forms/application.ts
    if (fakeData?.useFakeData === YES) {
      return {
        success: fakeData.qualityPhoto === YES,
        qualityPhoto:
          fakeData.qualityPhoto === YES
            ? `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIAAIAAgMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAH/9oACAEBAAAAAHP/xAAUAQEAAAAAAAAAAAAAAAAAAAAH/9oACAECEAAAADv/xAAUAQEAAAAAAAAAAAAAAAAAAAAG/9oACAEDEAAAAHn/xAAZEAABBQAAAAAAAAAAAAAAAAAAAgMTU5H/2gAIAQEAAT8AjbrTh//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z`
            : null,
      }
    }
  }
  if (
    (application.externalData.qualityPhoto as HasQualityPhotoData)?.data
      ?.hasQualityPhoto === false
  ) {
    return {
      success: false,
      qualityPhoto: null,
    }
  }

  const { data } = useQuery(QUALITY_PHOTO)

  return {
    success: data?.qualityPhoto?.success,
    qualityPhoto: data?.qualityPhoto?.qualityPhoto,
  } as QualityPhotoType
}
