import { Application, BaseField, FieldTypes } from '@island.is/application/core'

export const getDefaultValue = (field: BaseField, application: Application) => {
  const { defaultValue, type } = field

  if (type === FieldTypes.TEXT && !defaultValue) {
    return ''
  }

  if (!defaultValue) {
    return undefined
  }

  if (typeof defaultValue === 'function') {
    return defaultValue(application, field)
  }

  return defaultValue
}
