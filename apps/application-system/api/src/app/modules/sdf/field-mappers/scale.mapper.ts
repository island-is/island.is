import { FieldMapper } from './types'
import { asResolvableFormText, resolveFieldProp } from './utils'

/** `min`/`max` accept numeric strings in `ScaleField`; the DTO is numeric. */
const toNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'string' ? Number(value) : value
  return typeof parsed === 'number' && Number.isFinite(parsed)
    ? parsed
    : fallback
}

export const mapScaleField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  component.min = toNumber(raw.min, 0)
  component.max = toNumber(
    // `max` is `MaybeWithApplicationAndFieldAndLocale`, so it takes the field
    // and locale on top of the application.
    resolveFieldProp(raw.max, application, raw, resolver.currentLocale),
    10,
  )
  component.step = raw.step as number | undefined
  component.minLabel = resolver.resolve(asResolvableFormText(raw.minLabel))
  component.maxLabel = resolver.resolve(asResolvableFormText(raw.maxLabel))
  component.showLabels = raw.showLabels as boolean | undefined
}
