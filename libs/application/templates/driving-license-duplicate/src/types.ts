import { FormValue } from '@island.is/application/types'

export type QualityPhotoData = {
  data: {
    qualityPhoto: string
    success: boolean
  }
}

export type ConditionFn = (answer: FormValue) => boolean

export type Photo = {
  qualityPhoto: string
  attachments: Array<{
    key: string
    name: string
  }>
}

export type Delivery = {
  district: string
}
