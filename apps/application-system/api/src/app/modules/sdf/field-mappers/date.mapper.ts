import { FieldMapper } from './types'
import { formatDateFieldBoundary, resolveFieldProp } from './utils'

export const mapDateField: FieldMapper = (component, raw, { application }) => {
  const min = resolveFieldProp(raw.minDate, application)
  const max = resolveFieldProp(raw.maxDate, application)
  component.minDate = formatDateFieldBoundary(min as Date | string | undefined)
  component.maxDate = formatDateFieldBoundary(max as Date | string | undefined)
}
