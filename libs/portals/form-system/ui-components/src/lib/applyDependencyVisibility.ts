import { FormSystemDependency, FormSystemSection } from '@island.is/api/schema'
import {
  FieldTypesEnum,
  getHiddenMultisetFieldIds,
  isDependencyController,
  isDependencySelected,
  SectionTypes,
} from '@island.is/form-system/shared'

export const applyDependencyVisibility = (
  sections: FormSystemSection[],
  dependencies: readonly (FormSystemDependency | null)[],
) => {
  let nextSections = sections
  let nextDependencies = dependencies.filter(
    (dependency): dependency is FormSystemDependency =>
      !!dependency?.parentProp,
  )
  let changed = true

  while (changed) {
    changed = false
    nextDependencies = nextDependencies.map((dependency) => {
      for (const section of nextSections) {
        for (const screen of section.screens ?? []) {
          const controller = screen?.fields?.find(
            (field) =>
              field && isDependencyController(field, dependency.parentProp),
          )
          if (!controller) continue
          const isSelected = isDependencySelected(
            controller,
            dependency.parentProp,
            screen?.isMulti && controller.isPartOfMultiset !== false
              ? undefined
              : 0,
          )
          if (isSelected !== dependency.isSelected) changed = true
          return { ...dependency, isSelected }
        }
      }
      return dependency
    })

    const isHidden = (id?: string | null) => {
      const parents = nextDependencies.filter((dependency) =>
        id ? dependency.childProps?.includes(id) : false,
      )
      return (
        parents.length > 0 &&
        !parents.some((dependency) => dependency.isSelected)
      )
    }

    nextSections = nextSections.map((section) => {
      if (
        section.sectionType === SectionTypes.PARTIES ||
        section.sectionType === SectionTypes.SUMMARY
      )
        return section
      const sectionHidden = isHidden(section.id)
      return {
        ...section,
        isHidden: sectionHidden,
        screens: section.screens?.map((screen) => {
          if (!screen) return screen
          const screenHidden = sectionHidden || isHidden(screen.id)
          const visibleScreen = {
            ...screen,
            isHidden: screenHidden,
            fields: screen.fields?.map((field) =>
              field
                ? { ...field, isHidden: screenHidden || isHidden(field.id) }
                : field,
            ),
          }
          const hiddenRows = Array.from(
            {
              length: Math.max(
                1,
                ...(screen.fields ?? []).map(
                  (field) => field?.values?.length ?? 0,
                ),
              ),
            },
            (_, index) =>
              getHiddenMultisetFieldIds(visibleScreen, nextDependencies, index),
          )
          return {
            ...visibleScreen,
            fields: visibleScreen.fields?.map((field) => {
              const isCheckbox = field?.fieldType === FieldTypesEnum.CHECKBOX
              const isList =
                field?.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
                field?.fieldType === FieldTypesEnum.RADIO_BUTTONS
              if (!field || (!isCheckbox && !isList)) return field
              return {
                ...field,
                values: field.values?.map((value, index) => {
                  if (
                    !value ||
                    (!field.isHidden && !hiddenRows[index]?.has(field.id))
                  )
                    return value
                  const reset = isCheckbox
                    ? { checkboxValue: false }
                    : { label: null, value: null }
                  if (
                    isCheckbox
                      ? value.json?.checkboxValue === false
                      : value.json?.label === null && value.json?.value === null
                  )
                    return value
                  changed = true
                  return { ...value, json: { ...value.json, ...reset } }
                }),
              }
            }),
          }
        }),
      }
    })
  }
  return { sections: nextSections, dependencies: nextDependencies }
}
