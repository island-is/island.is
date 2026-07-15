import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapKeyValueField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const resolved = resolveFieldProp(raw.value, application)
  component.value = resolver.resolve(
    resolved == null ? undefined : asResolvableFormText(resolved),
  )
}
