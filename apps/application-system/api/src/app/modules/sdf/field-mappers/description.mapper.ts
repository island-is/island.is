import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapDescriptionField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  if (raw.description) {
    component.description = resolver.resolve(
      asResolvableFormText(raw.description),
    )
  }
}
