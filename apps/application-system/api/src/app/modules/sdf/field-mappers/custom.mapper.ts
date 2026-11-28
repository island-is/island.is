import { FieldMapper } from './types'
import { resolveFieldProp } from './utils'

export const mapCustomField: FieldMapper = (
  component,
  raw,
  { application },
) => {
  component.componentName = raw.component as string | undefined
  try {
    const propsValue = resolveFieldProp(raw.props, application)
    component.props = propsValue ? JSON.stringify(propsValue) : undefined
  } catch {
    component.props = undefined
  }
}
