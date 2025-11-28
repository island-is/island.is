import {
  FormSystemDependency as Dependency,
  FormSystemField,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'
import { ApplicationState, FieldTypesEnum } from '@island.is/form-system/ui'

const normalizeDependencies = (
  dependencies: Maybe<Maybe<Dependency>[]> | undefined,
): Dependency[] => {
  return (dependencies ?? []).filter(
    (d): d is Dependency => !!d && !!d.parentProp,
  )
}

const buildGraph = (dependencies: Dependency[]): Record<string, string[]> => {
  const graph: Record<string, string[]> = {}

  for (const dep of dependencies) {
    if (dep?.parentProp) {
      graph[dep.parentProp] = (dep.childProps ?? []).filter(
        (c): c is string => typeof c === 'string',
      )
    }
  }

  return graph
}

const buildFieldMap = (
  sections: FormSystemSection[],
): Record<string, FormSystemField> => {
  const map: Record<string, FormSystemField> = {}

  sections.forEach((section) => {
    section.screens?.forEach((screen) => {
      if (!screen) return
      screen.fields?.forEach((field) => {
        if (!field?.id) return
        map[field.id] = field as FormSystemField
      })
    })
  })

  return map
}

const buildControllerParentsByFieldId = (
  fieldsById: Record<string, FormSystemField>,
  dependencies: Dependency[],
): Record<string, string[]> => {
  const parentSet = new Set<string>()
  dependencies.forEach((d) => {
    if (d.parentProp) parentSet.add(d.parentProp)
  })

  const controllerParentsByFieldId: Record<string, string[]> = {}

  Object.values(fieldsById).forEach((field) => {
    const ids: string[] = []

    if (field.fieldType === FieldTypesEnum.CHECKBOX) {
      if (parentSet.has(field.id)) {
        ids.push(field.id)
      }
    } else if (
      field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
      field.fieldType === FieldTypesEnum.DROPDOWN_LIST
    ) {
      const itemIds = field.list?.map((item) => item?.id).filter(Boolean) ?? []
      itemIds.forEach((id) => {
        if (id && parentSet.has(id)) {
          ids.push(id)
        }
      })
    }

    if (ids.length) {
      controllerParentsByFieldId[field.id] = ids
    }
  })

  return controllerParentsByFieldId
}

const collectCascadeOffParents = (
  dependencies: Dependency[],
  initiallyOff: string[],
  fieldsById: Record<string, FormSystemField>,
): Set<string> => {
  const graph = buildGraph(dependencies)
  const controllerParentsByFieldId = buildControllerParentsByFieldId(
    fieldsById,
    dependencies,
  )

  const off = new Set(initiallyOff)
  const queue = [...initiallyOff]

  while (queue.length > 0) {
    const parent = queue.shift() as string
    const children = graph[parent] ?? []

    for (const child of children) {
      if (!off.has(child)) {
        off.add(child)
        queue.push(child)
      }

      const controllerParents = controllerParentsByFieldId[child]
      if (controllerParents) {
        for (const cp of controllerParents) {
          if (!off.has(cp)) {
            off.add(cp)
            queue.push(cp)
          }
        }
      }
    }
  }

  return off
}

const isHiddenByDependencies = (
  id: string | undefined | null,
  dependencies: Dependency[],
): boolean => {
  if (!id) return false

  const relevantDeps = dependencies.filter((dep) =>
    dep.childProps?.includes(id),
  )

  if (relevantDeps.length === 0) {
    return false
  }

  const anySelected = relevantDeps.some((dep) => dep.isSelected)

  return !anySelected
}

const applyVisibilityToSections = (
  sections: FormSystemSection[],
  dependencies: Dependency[],
): FormSystemSection[] => {
  return sections.map((section) => {
    const sectionHidden = isHiddenByDependencies(section.id, dependencies)

    const screens = section.screens?.map((screen) => {
      if (!screen) return screen

      const screenHidden = isHiddenByDependencies(screen.id, dependencies)

      const fields = screen.fields?.map((field) => {
        if (!field) return field

        const fieldHidden = isHiddenByDependencies(field.id, dependencies)

        let newValues = field.values

        if (fieldHidden && field.fieldType === FieldTypesEnum.CHECKBOX) {
          newValues = field.values?.map((v) => ({
            ...v,
            json: v?.json
              ? {
                  ...v.json,
                  checkboxValue: undefined,
                }
              : { checkboxValue: undefined as unknown as boolean },
          }))
        }

        if (
          fieldHidden &&
          (field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
            field.fieldType === FieldTypesEnum.DROPDOWN_LIST)
        ) {
          newValues = field.values?.map((v) => ({
            ...v,
            json: v?.json
              ? {
                  ...v.json,
                  listValue: undefined,
                }
              : { listValue: undefined as unknown as string },
          }))
        }

        return {
          ...field,
          isHidden: fieldHidden,
          values: newValues,
        }
      }) as typeof screen.fields

      return {
        ...screen,
        isHidden: screenHidden,
        fields,
      }
    }) as typeof section.screens

    return {
      ...section,
      isHidden: sectionHidden,
      screens,
    }
  })
}

const isControllerField = (
  field: Maybe<FormSystemField> | undefined,
  dependencies: Dependency[],
): boolean => {
  if (!field) return false

  if (field.fieldType === FieldTypesEnum.CHECKBOX) {
    return dependencies.some((dependency) => dependency.parentProp === field.id)
  }

  if (
    field.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
    field.fieldType === FieldTypesEnum.DROPDOWN_LIST
  ) {
    const listItemIds =
      field.list?.map((item) => item?.id).filter(Boolean) ?? []
    return dependencies.some((dependency) =>
      listItemIds.includes(dependency.parentProp ?? ''),
    )
  }

  return false
}

export const setFieldValue = (
  state: ApplicationState,
  fieldProperty: string,
  fieldId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): ApplicationState => {
  const { currentScreen } = state
  if (!currentScreen || !currentScreen.data) {
    return state
  }

  const screen = currentScreen.data

  // 1. Update the field's value on the current screen
  const updatedFields = screen.fields?.map((field) => {
    if (field?.id === fieldId) {
      let newValue = field?.values?.[0] ?? {}
      newValue = {
        ...newValue,
        json: {
          ...newValue.json,
          [fieldProperty]: value,
        },
      }
      return {
        ...field,
        values: [newValue],
      }
    }
    return field
  })

  const updatedScreen = {
    ...screen,
    fields: updatedFields,
  }

  // Update sections with the updated screen (before dependency visibility)
  const updatedSectionsBeforeDeps: FormSystemSection[] = state.sections.map(
    (section) => {
      if (section.screens) {
        return {
          ...section,
          screens: section.screens.map((s) => {
            if (s?.id === updatedScreen.id) {
              return updatedScreen
            }
            return s
          }),
        }
      }
      return section
    },
  )

  // 2. Dependency handling
  const currentField = screen.fields?.find((f) => f?.id === fieldId)
  const normalizedDeps = normalizeDependencies(state.application.dependencies)
  let depsArray = [...normalizedDeps]

  const fieldsById = buildFieldMap(updatedSectionsBeforeDeps)

  const controller = isControllerField(currentField, depsArray)

  if (!controller) {
    return {
      ...state,
      application: {
        ...state.application,
        sections: updatedSectionsBeforeDeps,
      },
      sections: updatedSectionsBeforeDeps,
      currentScreen: {
        ...currentScreen,
        data: updatedScreen,
      },
      errors: state.errors && state.errors.length > 0 ? state.errors ?? [] : [],
    }
  }

  const isListField =
    currentField?.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
    currentField?.fieldType === FieldTypesEnum.DROPDOWN_LIST

  const selectedItem =
    isListField && currentField?.list
      ? currentField.list.find((item) => item?.label?.is === String(value))
      : undefined

  const selectedItemId = (selectedItem?.id as string) ?? undefined
  const parentId = isListField ? selectedItemId ?? '' : fieldId

  const turnedOffParents: string[] = []

  if (isListField) {
    const listItemIds =
      currentField?.list?.map((item) => item?.id).filter(Boolean) ?? []

    depsArray = depsArray.map((dep) => {
      if (!listItemIds.includes(dep.parentProp ?? '')) {
        return dep
      }

      const wasSelected = dep.isSelected
      const nowSelected = selectedItemId
        ? dep.parentProp === selectedItemId
        : false

      if (wasSelected && !nowSelected) {
        turnedOffParents.push(dep.parentProp ?? '')
      }

      return {
        ...dep,
        isSelected: nowSelected,
      }
    })
  } else {
    const depForField = depsArray.find((d) => d.parentProp === parentId)
    const prevSelected = depForField?.isSelected ?? false
    const newSelected = !prevSelected

    depsArray = depsArray.map((dep) => {
      if (dep.parentProp !== parentId) return dep

      if (prevSelected && !newSelected) {
        turnedOffParents.push(parentId)
      }

      return {
        ...dep,
        isSelected: newSelected,
      }
    })
  }

  if (turnedOffParents.length > 0) {
    const allOffParents = collectCascadeOffParents(
      depsArray,
      turnedOffParents,
      fieldsById,
    )

    depsArray = depsArray.map((dep) => {
      if (allOffParents.has(dep.parentProp ?? '')) {
        return {
          ...dep,
          isSelected: false,
        }
      }
      return dep
    })
  }

  const updatedSections = applyVisibilityToSections(
    updatedSectionsBeforeDeps,
    depsArray,
  )
  const updatedState = {
    ...state,
    application: {
      ...state.application,
      sections: updatedSections,
      dependencies: depsArray as unknown as Maybe<Maybe<Dependency>[]>,
    },
    sections: updatedSections,
    currentScreen: {
      ...currentScreen,
      data:
        updatedSections[state.currentSection.index]?.screens?.[
          currentScreen.index
        ] ?? undefined,
    },
    errors: state.errors && state.errors.length > 0 ? state.errors ?? [] : [],
  }

  return updatedState
}
