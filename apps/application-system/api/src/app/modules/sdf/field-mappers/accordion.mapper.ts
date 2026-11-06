import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapAccordionField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const accordionItems = resolveFieldProp(raw.accordionItems, application) as
    | Array<{ itemTitle: unknown; itemContent?: unknown }>
    | undefined
  component.items = (accordionItems ?? []).map((item) => ({
    label: resolver.resolve(asResolvableFormText(item.itemTitle)) || '',
    content: resolver.resolve(asResolvableFormText(item.itemContent)) || '',
  }))
}
