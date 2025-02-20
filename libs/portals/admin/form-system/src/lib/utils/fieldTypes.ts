import { Option } from '@island.is/island-ui/core'
import { FieldTypesEnum } from '@island.is/form-system-dataTypes'

export const getFieldTypeValue = (type: string) => {
  return FieldTypesEnum[type as keyof typeof FieldTypesEnum]
}

export const getFieldTypeKey = (value: string) => {
  return (
    Object.keys(FieldTypesEnum).find(
      (key) => FieldTypesEnum[key as keyof typeof FieldTypesEnum] === value,
    ) || ''
  )
}

export const fieldTypesSelectObject = (): readonly Option<string>[] => {
  const fieldTypes = Object.keys(FieldTypesEnum).map((key) => ({
    label: FieldTypesEnum[key as keyof typeof FieldTypesEnum],
    value: FieldTypesEnum[key as keyof typeof FieldTypesEnum],
  }))
  return fieldTypes
}
