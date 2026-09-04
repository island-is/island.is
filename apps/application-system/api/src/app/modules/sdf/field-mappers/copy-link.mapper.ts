import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapCopyLinkField: FieldMapper = (component, raw, { resolver }) => {
  if (raw.title) {
    component.copyLinkTitle = resolver.resolve(asResolvableFormText(raw.title))
  }
  component.copyLinkText = resolver.resolve(asResolvableFormText(raw.link))
  if (raw.buttonTitle) {
    component.copyButtonTitle = resolver.resolve(
      asResolvableFormText(raw.buttonTitle),
    )
  }
}
