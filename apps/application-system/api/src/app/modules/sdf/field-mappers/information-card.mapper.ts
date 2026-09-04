import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapInformationCardField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const items = resolveFieldProp(raw.items, application, raw) as
    | Array<{ label: unknown; value: unknown }>
    | undefined
  component.informationCardItems = (items ?? []).map((item) => ({
    label: resolver.resolve(asResolvableFormText(item.label)) || '',
    value: resolver.resolve(asResolvableFormText(item.value)) || '',
  }))
}
