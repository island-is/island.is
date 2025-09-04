import {
  FormSystemDependency,
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'
import {
  ApplicationState,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/ui'
import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import {
  hasScreens,
  nextVisibleScreenInSection,
  nextVisibleSectionIndex,
  firstVisibleScreenIndex,
  prevVisibleScreenInSection,
  prevVisibleSectionIndex,
  lastVisibleScreenIndex,
} from '../utils/reducerHelpers'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const getIncrementVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]

  const currentScreenIndex = hasScreens(currentSectionData)
    ? currentScreen?.index ?? -1
    : -1

  return {
    currentSectionData,
    currentSectionIndex,
    currentScreenIndex,
  }
}

export const getDecrementVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]

  const currentScreenIndex = hasScreens(currentSectionData)
    ? currentScreen?.index ?? -1
    : -1

  return {
    currentSectionData,
    currentSectionIndex,
    currentScreenIndex,
  }
}

export const incrementWithScreens = (
  state: ApplicationState,
  currentSectionData: FormSystemSection,
  currentScreenIndex: number,
  submitScreenMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const [submitScreen] = submitScreenMutation
  const errors = state.errors ?? []
  const isValid = state.isValid ?? true

  // Stop on validation errors
  if (errors.length > 0 || !isValid) {
    return { ...state, errors }
  }

  // Submit current screen for INPUT sections
  if (currentSectionData.sectionType === SectionTypes.INPUT) {
    submitScreen({
      variables: {
        input: {
          screenId: state.currentScreen?.data?.id,
          submitScreenDto: {
            applicationId: state.application.id,
            screenDto: state.currentScreen?.data,
          },
        },
      },
    }).catch((error) => {
      console.error('Error submitting screen:', error)
    })
  }

  const sections = state.sections ?? []
  const curSecIdx = state.currentSection.index
  const section = sections[curSecIdx] as FormSystemSection | undefined

  const nextScreenIdx = nextVisibleScreenInSection(section, currentScreenIndex)
  if (nextScreenIdx !== -1) {
    const nextScreen = section!.screens![nextScreenIdx] as FormSystemScreen
    return {
      ...state,
      currentScreen: { index: nextScreenIdx, data: nextScreen },
      errors: [],
    }
  }

  const nextSecIdx = nextVisibleSectionIndex(sections, curSecIdx)
  if (nextSecIdx === -1) {
    return { ...state, errors: [] }
  }

  const nextSection = sections[nextSecIdx] as FormSystemSection
  const firstScreenIdx = firstVisibleScreenIndex(nextSection.screens)

  return {
    ...state,
    currentSection: { index: nextSecIdx, data: nextSection },
    currentScreen:
      firstScreenIdx >= 0
        ? {
            index: firstScreenIdx,
            data: nextSection.screens![firstScreenIdx] as FormSystemScreen,
          }
        : undefined,
    errors: [],
  }
}

export const incrementWithoutScreens = (
  state: ApplicationState,
  submitSectionMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const [submitSection] = submitSectionMutation

  // Submit current section progress
  submitSection({
    variables: {
      input: {
        applicationId: state.application.id,
        sectionId: state.currentSection.data.id,
      },
    },
  })

  const sections = state.sections ?? []
  const curSecIdx = state.currentSection.index
  const nextSecIdx = nextVisibleSectionIndex(sections, curSecIdx)
  if (nextSecIdx === -1) return state
  const nextSection = sections[nextSecIdx] as FormSystemSection
  const firstScreenIdx = firstVisibleScreenIndex(nextSection.screens)

  return {
    ...state,
    currentSection: { data: nextSection, index: nextSecIdx },
    currentScreen:
      firstScreenIdx >= 0
        ? {
            data: nextSection.screens![firstScreenIdx] as FormSystemScreen,
            index: firstScreenIdx,
          }
        : undefined,
    errors: [],
  }
}

export const decrementWithScreens = (
  state: ApplicationState,
  currentSectionIndex: number,
  currentScreenIndex: number,
): ApplicationState => {
  const sections = state.sections ?? []
  const section = sections[currentSectionIndex] as FormSystemSection | undefined

  const prevScreenIdx = prevVisibleScreenInSection(section, currentScreenIndex)
  if (prevScreenIdx !== -1) {
    const prevScreen = section!.screens![prevScreenIdx] as FormSystemScreen
    return {
      ...state,
      currentScreen: { data: prevScreen, index: prevScreenIdx },
      errors: [],
    }
  }

  const prevSecIdx = prevVisibleSectionIndex(sections, currentSectionIndex)
  if (prevSecIdx === -1) {
    return state
  }

  const prevSection = sections[prevSecIdx] as FormSystemSection
  const lastScreenIdx = lastVisibleScreenIndex(prevSection.screens)

  return {
    ...state,
    currentSection: { data: prevSection, index: prevSecIdx },
    currentScreen:
      lastScreenIdx >= 0
        ? {
            data: prevSection.screens![lastScreenIdx] as FormSystemScreen,
            index: lastScreenIdx,
          }
        : undefined,
    errors: [],
  }
}

export const decrementWithoutScreens = (
  state: ApplicationState,
  currentSectionIndex: number,
): ApplicationState => {
  const sections = state.sections ?? []
  const prevSecIdx = prevVisibleSectionIndex(sections, currentSectionIndex)
  if (prevSecIdx === -1) return state

  const prevSection = sections[prevSecIdx] as FormSystemSection
  const lastScreenIdx = lastVisibleScreenIndex(prevSection.screens)

  return {
    ...state,
    currentSection: { data: prevSection, index: prevSecIdx },
    currentScreen:
      lastScreenIdx >= 0
        ? {
            data: prevSection.screens![lastScreenIdx] as FormSystemScreen,
            index: lastScreenIdx,
          }
        : undefined,
    errors: [],
  }
}

export const setCurrentScreen = (
  state: ApplicationState,
  sectionIndex: number,
  screenIndex: number,
): ApplicationState => {
  const sections = state.sections ?? []
  if (sectionIndex < 0 || sectionIndex >= sections.length) {
    return state
  }
  const currentSection = sections[sectionIndex] as FormSystemSection
  const screens = currentSection.screens ?? []
  let currentScreen: FormSystemScreen | undefined
  if (
    hasScreens(currentSection) &&
    screenIndex >= 0 &&
    screenIndex < screens.length
  ) {
    const candidate = screens[screenIndex] as
      | FormSystemScreen
      | null
      | undefined
    currentScreen =
      candidate && candidate.isHidden !== true
        ? (candidate as FormSystemScreen)
        : undefined
  } else {
    currentScreen = undefined
  }
  return {
    ...state,
    currentSection: {
      data: currentSection,
      index: sectionIndex,
    },
    currentScreen:
      currentScreen !== undefined
        ? { data: currentScreen, index: screenIndex }
        : undefined,
  }
}

export const setError = (
  state: ApplicationState,
  fieldId: string,
  hasError: boolean,
): ApplicationState => {
  const errorArray = Array.isArray(state.errors) ? state.errors : []
  const filteredArray = hasError
    ? [...errorArray, fieldId]
    : errorArray.filter((id) => id !== fieldId)
  return { ...state, errors: filteredArray }
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
    } else {
      return field
    }
  })

  const updatedScreen = {
    ...screen,
    fields: updatedFields,
  }

  const updatedSections: FormSystemSection[] = state.sections.map((section) => {
    if (section.screens) {
      return {
        ...section,
        screens: section.screens.map((screen) => {
          if (screen?.id === updatedScreen.id) {
            return updatedScreen
          }
          return screen
        }),
      }
    }
    return section
  })

  const currentField = screen.fields?.find((field) => field?.id === fieldId)
  let { dependencies: newDependencies } = state.application
  const dependenciesChanged = isControllerField(currentField, newDependencies)

  if (dependenciesChanged) {
    newDependencies = newDependencies?.map((dependency) => {
      if (dependency?.parentProp === fieldId) {
        return {
          ...dependency,
          isSelected: !dependency.isSelected,
        }
      }
      return dependency
    })

    const updatedSectionsWithDependencies = updatedSections.map((section) => {
      const isSectionHidden = newDependencies?.some(
        (dependency) =>
          dependency?.childProps?.includes(section?.id ?? '') &&
          !dependency?.isSelected,
      )

      return {
        ...section,
        id: section?.id ?? '',
        isHidden: isSectionHidden ?? section?.isHidden,
        screens: section.screens?.map((screen) => {
          const isScreenHidden = newDependencies?.some(
            (dependency) =>
              dependency?.childProps?.includes(screen?.id ?? '') &&
              !dependency?.isSelected,
          )

          return {
            ...screen,
            id: screen?.id ?? '',
            isHidden: isScreenHidden ?? screen?.isHidden,
            fields: screen?.fields?.map((field) => {
              const isFieldHidden = newDependencies?.some(
                (dependency) =>
                  dependency?.childProps?.includes(field?.id ?? '') &&
                  !dependency?.isSelected,
              )
              return {
                ...field,
                id: field?.id ?? '',
                isHidden: isFieldHidden ?? field?.isHidden,
              } as FormSystemField
            }) as FormSystemField[] | undefined,
          } as FormSystemScreen
        }) as FormSystemScreen[] | undefined,
      } as FormSystemSection
    })

    return {
      ...state,
      application: {
        ...state.application,
        sections: updatedSectionsWithDependencies,
        dependencies: newDependencies,
      },
      sections: updatedSectionsWithDependencies,
      currentScreen: {
        ...currentScreen,
        data:
          updatedSectionsWithDependencies[state.currentSection.index]
            ?.screens?.[currentScreen.index] ?? undefined,
      },
      errors: state.errors && state.errors.length > 0 ? state.errors ?? [] : [],
    }
  }

  return {
    ...state,
    application: {
      ...state.application,
      sections: updatedSections,
    },
    sections: updatedSections,
    currentScreen: {
      ...currentScreen,
      data: updatedScreen,
    },
    errors: state.errors && state.errors.length > 0 ? state.errors ?? [] : [],
  }
}

const isControllerField = (
  field: Maybe<FormSystemField> | undefined,
  dependencies: Maybe<Maybe<FormSystemDependency>[]> | undefined,
): boolean => {
  if (
    field?.fieldType === FieldTypesEnum.CHECKBOX ||
    field?.fieldType === FieldTypesEnum.RADIO_BUTTONS ||
    field?.fieldType === FieldTypesEnum.DROPDOWN_LIST
  ) {
    return (
      dependencies?.some((dependency) => {
        return dependency?.parentProp === field?.id
      }) ?? false
    )
  }
  return false
}
