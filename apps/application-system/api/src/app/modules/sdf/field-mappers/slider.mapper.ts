import { FieldMapper } from './types'
import { resolveFieldProp } from './utils'

export const mapSliderField: FieldMapper = (
  component,
  raw,
  { application },
) => {
  component.min = (raw.min as number | undefined) ?? 0
  component.max = (resolveFieldProp(raw.max, application) as number) ?? 100
  component.step = raw.step as number | undefined
}
