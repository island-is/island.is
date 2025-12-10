import { FormSystemField } from '@island.is/api/schema'

/**
 * Find the first field whose fieldSettings contains the given key/value.
 */
export const getFieldBySettings = function (
  key: string,
  value: string,
  fields: Array<FormSystemField | null | undefined>,
): FormSystemField | undefined {
  return fields.find((field): field is FormSystemField => {
    if (!field) return false
    const fs = (field.fieldSettings ?? {}) as Record<string, string>
    return Object.prototype.hasOwnProperty.call(fs, key) && fs[key] === value
  })
}
