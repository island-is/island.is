import { FieldMapper } from './types'
import { applyRefetchMetadata } from './utils'

export const mapSelectField: FieldMapper = (component, raw) => {
  applyRefetchMetadata(component, raw)
}
