import { FieldMapper } from './types'

export const mapHiddenInputWithWatchedValueField: FieldMapper = (
  component,
  raw,
) => {
  component.watchValue = (raw.watchValue as string | undefined) ?? ''
}
