import { ReferenceFieldMappingProps } from './ReferenceFieldMapping'

export type FileData = string[][]

export const isPrimitiveField = (field: { type: string }) => {
  return (
    field.type === 'Symbol' ||
    field.type === 'Integer' ||
    field.type === 'RichText'
  )
}

export const extractContentType = (
  field: ReferenceFieldMappingProps['referenceFieldMapping'][number],
) => {
  let validations = field.contentfulField.data.validations ?? []
  if (validations.length === 0) {
    validations = field.contentfulField.data.items?.validations ?? []
  }
  return validations.find((v) => v?.linkContentType)?.linkContentType?.[0] ?? ''
}
