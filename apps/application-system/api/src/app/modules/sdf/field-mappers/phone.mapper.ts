import { FieldMapper } from './types'
import { resolveFieldProp } from './utils'

export const mapPhoneField: FieldMapper = (component, raw, { application }) => {
  const enableCountrySelector = resolveFieldProp(
    raw.enableCountrySelector as boolean | ((...args: unknown[]) => boolean),
    application,
  )
  if (enableCountrySelector !== undefined) {
    component.enableCountrySelector = enableCountrySelector
  }

  if (Array.isArray(raw.allowedCountryCodes)) {
    component.allowedCountryCodes = raw.allowedCountryCodes as string[]
  }
}
