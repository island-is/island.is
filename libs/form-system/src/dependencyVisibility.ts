import { FieldTypesEnum } from './enums'

interface Dependency {
  parentProp?: string | null
  childProps?: readonly (string | null)[] | null
  isSelected?: boolean | null
}

interface Field {
  id?: string | null
  fieldType?: string | null
  isHidden?: boolean | null
  isPartOfMultiset?: boolean | null
  values?:
    | readonly ({
        json?: {
          checkboxValue?: boolean | null
          label?: { is?: string | null } | null
        } | null
      } | null)[]
    | null
  list?:
    | readonly ({
        id?: string | null
        label?: { is?: string | null } | null
      } | null)[]
    | null
}

interface Screen {
  isMulti?: boolean | null
  fields?: readonly (Field | null)[] | null
}

export const isDependencyController = (
  field: Field,
  parentProp?: string | null,
) =>
  field.fieldType === FieldTypesEnum.CHECKBOX
    ? field.id === parentProp
    : (field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
        field.fieldType === FieldTypesEnum.DROPDOWN_LIST) &&
      !!field.list?.some((option) => option?.id === parentProp)

export const isDependencySelected = (
  field: Field,
  parentProp?: string | null,
  valueIndex?: number,
): boolean => {
  const values =
    valueIndex === undefined ? field.values : [field.values?.[valueIndex]]
  if (field.fieldType === FieldTypesEnum.CHECKBOX) {
    return values?.some((value) => value?.json?.checkboxValue === true) ?? false
  }
  const option = field.list?.find((item) => item?.id === parentProp)
  return (
    !!option?.label?.is &&
    (values?.some((value) => value?.json?.label?.is === option.label?.is) ??
      false)
  )
}

export const getHiddenMultisetFieldIds = (
  screen: Screen,
  dependencies: readonly (Dependency | null)[] | null | undefined,
  valueIndex: number,
): Set<string> => {
  const fields = (screen.fields ?? []).filter(
    (field): field is Field => !!field,
  )
  const hidden = new Set(
    fields.filter((field) => field.isHidden).map((field) => field.id ?? ''),
  )
  if (!screen.isMulti) return hidden

  let changed = true
  while (changed) {
    changed = false
    for (const field of fields) {
      if (!field.id || field.isPartOfMultiset === false || hidden.has(field.id))
        continue
      const parents = (dependencies ?? []).filter(
        (dependency): dependency is Dependency =>
          !!dependency?.childProps?.includes(field.id ?? ''),
      )
      if (parents.length === 0) continue

      const visible = parents.some((dependency) => {
        const controller = fields.find((parent) =>
          isDependencyController(parent, dependency.parentProp),
        )
        if (!controller || controller.isPartOfMultiset === false) {
          return dependency.isSelected === true
        }
        return (
          !hidden.has(controller.id ?? '') &&
          isDependencySelected(controller, dependency.parentProp, valueIndex)
        )
      })
      if (!visible) {
        hidden.add(field.id)
        changed = true
      }
    }
  }
  return hidden
}
