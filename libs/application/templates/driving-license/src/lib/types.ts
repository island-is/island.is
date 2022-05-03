import { FormValue } from '@island.is/application/core'

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}



export type ConditionFn = (answer: FormValue) => boolean
