import { Application, BaseField } from '@island.is/application/core'

export const useDefaultValue = (field: BaseField, application: Application) => {
  const { defaultValue } = field
  if (!defaultValue) {
    return undefined
  }
  if (typeof defaultValue === 'function') {
    return defaultValue(application)
  }
  return defaultValue
}
