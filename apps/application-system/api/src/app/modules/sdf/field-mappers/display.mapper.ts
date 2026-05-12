import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapDisplayField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  console.log('[SDF display debug] API mapDisplayField raw', {
    id: raw.id,
    clientExpression: raw.clientExpression,
    keys: Object.keys(raw),
  })
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
  if (raw.clientExpression && typeof raw.clientExpression === 'object') {
    component.clientExpression = raw.clientExpression as Record<string, unknown>
  }
  console.log('[SDF display debug] API mapDisplayField component', {
    id: component.id,
    clientExpression: component.clientExpression,
    value: component.value,
  })
}
