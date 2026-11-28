import { FieldMapper } from './types'
import { applyRefetchMetadata } from './utils'

export const mapSearchField: FieldMapper = (component, raw) => {
  applyRefetchMetadata(component, raw)
  component.searchAction = String(raw.searchAction ?? '')
  component.minQueryLength =
    typeof raw.minQueryLength === 'number' ? raw.minQueryLength : undefined
}
