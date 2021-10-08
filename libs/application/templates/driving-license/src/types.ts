import { FormValue } from '@island.is/application/core'

export type QualityPhotoData = {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

export type ConditionFn = (answer: FormValue) => boolean
