import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapCheckboxField: FieldMapper = (component, raw, { resolver }) => {
  if (raw.strong === true) component.strong = true
  if (raw.large === true) component.large = true
  if (raw.spacing === 0 || raw.spacing === 1 || raw.spacing === 2) {
    component.spacing = raw.spacing
  }

  const bg = raw.backgroundColor
  if (bg === 'blue' || bg === 'white') {
    component.checkboxBackgroundColor = bg
  }

  if (raw.description) {
    component.description = resolver.resolve(asResolvableFormText(raw.description))
  }
}
