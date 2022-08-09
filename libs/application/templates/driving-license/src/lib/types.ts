import { FormValue } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

export type HasQualityPhotoData = {
  data: {
    hasQualityPhoto: boolean
  }
}

export type ConditionFn = (answer: FormValue) => boolean

export type ApplicationInfoMessage = {
  title: MessageDescriptor
  rightsDescription?: MessageDescriptor
  applicationDescription?: MessageDescriptor
}
