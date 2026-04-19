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

const isFieldInDependencies = (
  id: string | null | undefined,
  dependencyArray?: Array<FormSystemDependency | null>,
) => {
  if (id == null || !dependencyArray) return false

  return dependencyArray.some((dependency) => {
    const childProps =
      dependency?.childProps?.filter(
        (child): child is string => child != null,
      ) ?? []

    return dependency?.parentProp === id || childProps.includes(id)
  })
}

const filterEmptyDependencies = (
  dependencies: FormSystemDependency[],
): FormSystemDependency[] =>
  dependencies.filter(
    (dep) => Array.isArray(dep.childProps) && dep.childProps.length > 0,
  )

const removeIdsFromDependencies = (
  dependencies: FormSystemDependency[],
  idsToRemove: string[],
): FormSystemDependency[] => {
  return filterEmptyDependencies(
    dependencies
      .filter(
        (dep) =>
          dep.parentProp == null || !idsToRemove.includes(dep.parentProp),
      )
      .map((dep) => ({
        ...dep,
        childProps: dep.childProps?.filter(
          (child): child is string =>
            child != null && !idsToRemove.includes(child),
        ),
      })),
  )
}

const getListItemIds = (field: FormSystemField): string[] =>
  field.list
    ?.map((item) => item?.id)
    .filter((id): id is string => id != null) ?? []

const getIdsToRemove = (field: FormSystemField): string[] => {
  const ids = new Set<string>()

  if (field.id != null) {
    ids.add(field.id)
  }

  const paymentQuantityId = field.fieldSettings?.paymentQuantityId

  if (field.fieldType === FieldTypesEnum.PAYMENT && paymentQuantityId != null) {
    ids.add(paymentQuantityId)
  }

  return [...ids]
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
    const listItemIds = getListItemIds(field)

    return dependencies.filter(
      (dep) => !listItemIds.includes(dep.parentProp as string),
    )
  }

  if (fieldType === FieldTypesEnum.PAYMENT) {
    const idsToRemove = getIdsToRemove(field)

    return dependencies.filter(
      (dep) => !idsToRemove.includes(dep.parentProp as string),
    )
  }

  return dependencies.filter((dep) => dep.parentProp !== field.id)
}

export const removeAllDependencies = (
  dependencies: FormSystemDependency[],
  field: FormSystemField,
): FormSystemDependency[] => {
  const { fieldType } = field

  if (fieldType === FieldTypesEnum.CHECKBOX) {
    return filterEmptyDependencies(
      dependencies
        .filter((dep) => dep.parentProp !== field.id)
        .map((dep) => ({
          ...dep,
          childProps: dep.childProps?.filter((child) => child !== field.id),
        })),
    )
  }

  if (
    fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    fieldType === FieldTypesEnum.RADIO_BUTTONS
  ) {
    const listItemIds = getListItemIds(field)

    return removeIdsFromDependencies(dependencies, listItemIds)
  }

  if (fieldType === FieldTypesEnum.PAYMENT) {
    const idsToRemove = getIdsToRemove(field)

    return removeIdsFromDependencies(dependencies, idsToRemove)
  }

  return removeIdsFromDependencies(dependencies, field.id ? [field.id] : [])
}
