import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapAlertMessageField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  component.title = resolver.resolve(asResolvableFormText(raw.title)) || ''
  component.message = resolver.resolve(asResolvableFormText(raw.message))
  component.alertType = (raw.alertType as string | undefined) ?? 'info'
}
