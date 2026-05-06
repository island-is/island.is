import { FieldMapper } from './types'

export const mapFileUploadField: FieldMapper = (component, raw) => {
  component.maxSize = raw.maxSize as number | undefined
  component.accept = raw.uploadAccept as string | undefined
}
