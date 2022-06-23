import { FormValue } from '@island.is/application/core'

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
  deliveryMethod: string
  district: string
}
