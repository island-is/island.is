import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapDisplayField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const resolvedValue = resolveFieldProp(
    raw.value,
    application?.answers,
    application?.externalData,
  )
  component.value = resolver.resolve(
    resolvedValue == null ? undefined : asResolvableFormText(resolvedValue),
  )
  if (typeof raw.variant === 'string' && raw.variant.length > 0) {
    component.inputVariant = raw.variant
  }
  if (raw.rightAlign === true) {
    component.rightAlign = true
  }
  if (raw.suffix) {
    component.textSuffix = resolver.resolve(asResolvableFormText(raw.suffix))
  }
  if (typeof raw.titleVariant === 'string' && raw.titleVariant.length > 0) {
    component.titleVariant = raw.titleVariant
  }
  if (raw.halfWidthOwnline === true) {
    component.halfWidthOwnline = true
  }
  if (raw.label !== undefined) {
    component.displayInputLabel = resolver.resolve(
      asResolvableFormText(raw.label),
    )
  }
  if (raw.clientValueExpression !== undefined) {
    // `clientValueExpression` may be a resolver `(answers, externalData) =>
    // FormExpression` so authors can bake externalData-derived literals into the
    // tree (the client evaluator only sees flat answers). Resolve it to a static
    // tree here before it crosses the wire.
    const resolvedClientValueExpression = resolveFieldProp(
      raw.clientValueExpression,
      application?.answers,
      application?.externalData,
    )
    component.clientValueExpression = resolvedClientValueExpression as
      | Record<string, unknown>
      | string
      | number
      | boolean
  }
}
