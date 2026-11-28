import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

export const mapTextField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  component.maxLength = raw.maxLength as number | undefined

  if (raw.variant != null) {
    component.inputVariant = String(raw.variant)
  }
  if (raw.rows != null) {
    component.textareaRows = raw.rows as number
  }

  const resolvedBg = resolveFieldProp(raw.backgroundColor, application) as
    | string
    | undefined
  component.inputBackgroundColor =
    resolvedBg === 'white' || resolvedBg === 'blue' ? resolvedBg : 'blue'

  const readOnlyVal = resolveFieldProp(raw.readOnly, application)
  component.readOnly = readOnlyVal === true

  const rightAlignVal = resolveFieldProp(raw.rightAlign, application)
  component.rightAlign = rightAlignVal === true

  component.showMaxLength = raw.showMaxLength === true

  const thousandSepVal = resolveFieldProp(raw.thousandSeparator, application)
  component.thousandSeparator =
    thousandSepVal === true || raw.thousandSeparator === true

  if (raw.allowNegative === false) {
    component.allowNegative = false
  }

  if (typeof raw.format === 'string') {
    component.textFormat = raw.format
  }
  if (raw.suffix) {
    component.textSuffix = resolver.resolve(asResolvableFormText(raw.suffix))
  }

  const numMin = resolveFieldProp(raw.min, application) as number | undefined
  const numMax = resolveFieldProp(raw.max, application) as number | undefined
  if (numMin !== undefined) {
    component.textNumberMin = numMin
  }
  if (numMax !== undefined) {
    component.textNumberMax = numMax
  }
  if (raw.step != null) {
    component.textStep =
      typeof raw.step === 'string' ? raw.step : String(raw.step)
  }
}
