import { FieldMapper } from './types'
import { asResolvableFormText } from './utils'

export const mapFileUploadField: FieldMapper = (
  component,
  raw,
  { resolver },
) => {
  component.maxSize = raw.maxSize as number | undefined
  component.accept = raw.uploadAccept as string | undefined
  component.uploadMultiple = raw.uploadMultiple as boolean | undefined
  component.totalMaxSize = raw.totalMaxSize as number | undefined
  component.maxFileCount = raw.maxFileCount as number | undefined
  component.forImageUpload = raw.forImageUpload as boolean | undefined

  if (raw.uploadHeader) {
    component.uploadHeader = resolver.resolve(
      asResolvableFormText(raw.uploadHeader),
    )
  }
  if (raw.uploadDescription) {
    component.uploadDescription = resolver.resolve(
      asResolvableFormText(raw.uploadDescription),
    )
  }
  if (raw.uploadButtonLabel) {
    component.uploadButtonLabel = resolver.resolve(
      asResolvableFormText(raw.uploadButtonLabel),
    )
  }
  if (raw.maxSizeErrorText) {
    component.maxSizeErrorText = resolver.resolve(
      asResolvableFormText(raw.maxSizeErrorText),
    )
  }
  if (raw.introduction) {
    component.introduction = resolver.resolve(
      asResolvableFormText(raw.introduction),
    )
  }
}
