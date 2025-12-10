import { FormSystemDependency, FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'

export const hasDependency = (
  dependencyArray:
    | (FormSystemDependency | null | undefined)[]
    | undefined
    | null,
  id: string,
) => {
  if (!dependencyArray) return false
  return dependencyArray.some((dependency) => {
    return dependency?.parentProp === id || dependency?.childProps?.includes(id)
  })
}

export const removeParentDependency = (
  dependencies: FormSystemDependency[],
  field: FormSystemField,
): FormSystemDependency[] => {
  const { fieldType } = field
  if (fieldType === FieldTypesEnum.CHECKBOX) {
    return dependencies.filter((dep) => dep.parentProp !== field.id)
  }

  if (
    fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    fieldType === FieldTypesEnum.RADIO_BUTTONS
  ) {
    const listItemIds = field.list?.map((item) => item?.id) || []
    return dependencies.filter(
      (dep) => !listItemIds.includes(dep.parentProp as string),
    )
  }

  return dependencies
}

export const removeAllDependencies = (
  dependencies: FormSystemDependency[],
  field: FormSystemField,
): FormSystemDependency[] => {
  const { fieldType } = field
  if (fieldType === FieldTypesEnum.CHECKBOX) {
    return dependencies
      .filter((dep) => dep.parentProp !== field.id)
      .map((dep) => ({
        ...dep,
        childProps: dep.childProps?.filter((child) => child !== field.id),
      }))
      .filter((dep) => dep.childProps && dep.childProps.length > 0)
  }
  if (
    fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    fieldType === FieldTypesEnum.RADIO_BUTTONS
  ) {
    const listItemIds = field.list?.map((item) => item?.id) || []
    return dependencies
      .filter(
        (dep) =>
          !listItemIds.includes(dep.parentProp as string) ||
          dep.parentProp !== field.id,
      )
      .map((dep) => ({
        ...dep,
        childProps: dep.childProps?.filter(
          (child) =>
            child && (!listItemIds.includes(child) || child !== field.id),
        ),
      }))
      .filter((dep) => dep.childProps && dep.childProps.length > 0)
  }
  return dependencies
}
