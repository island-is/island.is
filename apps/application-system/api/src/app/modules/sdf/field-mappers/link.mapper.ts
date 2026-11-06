import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapLinkField: FieldMapper = (component, raw, { resolver }) => {
  component.url = resolver.resolve(asResolvableFormText(raw.link)) || ''
}
