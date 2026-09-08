import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapMessageWithLinkButtonField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  component.message = resolver.resolve(asResolvableFormText(raw.message)) || ''
  component.url = (raw.url as string | undefined) ?? ''
  component.buttonTitle =
    resolver.resolve(asResolvableFormText(raw.buttonTitle)) || ''
}
