import {
  Application,
  BaseField,
  FieldTypes,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'

export const getDefaultValue = (
  field: BaseField,
  application: Application,
  locale: Locale,
) => {
  const { defaultValue, type } = field

  if (type === FieldTypes.TEXT && !defaultValue) {
    return ''
  }

  if (defaultValue === undefined) {
    return undefined
  }

  if (typeof defaultValue === 'function') {
    return defaultValue(application, field, locale)
  }

  return defaultValue
}
