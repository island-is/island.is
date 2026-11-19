import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapExpandableDescriptionField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  component.description =
    resolver.resolve(asResolvableFormText(raw.description)) || ''
  component.introText = resolver.resolve(asResolvableFormText(raw.introText))
}
