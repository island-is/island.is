import { FieldMapper } from './types'

export const mapImageField: FieldMapper = (component, raw) => {
  component.imageUrl = typeof raw.image === 'string' ? raw.image : undefined
}
