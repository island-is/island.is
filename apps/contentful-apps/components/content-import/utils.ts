export type FileData = string[][]

export const isReferenceField = (field: { type: string }) => {
  return !(
    field.type === 'Symbol' ||
    field.type === 'Integer' ||
    field.type === 'RichText'
  )
}
