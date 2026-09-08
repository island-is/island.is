import { FieldMapper } from './types'
import { applyRefetchMetadata } from './utils'

export const mapSelectField: FieldMapper = (component, raw) => {
  component.isMulti = raw.isMulti === true
  applyRefetchMetadata(component, raw)
}
