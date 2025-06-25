import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { ApplicationState } from '@island.is/form-system/ui'
import { validateScreen } from '../utils/validation'
import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'

export const hasScreens = (section: FormSystemSection): boolean => {
  return Boolean(section.screens && section.screens.length > 0)
}

export const getIncrementVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]
  const maxSectionIndex = sections.length - 1
  const nextSectionIndex =
    currentSectionIndex < maxSectionIndex
      ? currentSectionIndex + 1
      : maxSectionIndex
  const currentScreenIndex = hasScreens(currentSectionData)
    ? currentScreen?.index ?? 0
    : 0

  return {
    currentSectionData,
    maxSectionIndex,
    nextSectionIndex,
    currentScreenIndex,
  }
}

export const getDecrementVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]
  const prevSectionIndex = currentSectionIndex > 0 ? currentSectionIndex - 1 : 0
  const currentScreenIndex = hasScreens(currentSectionData)
    ? currentScreen?.index ?? 0
    : 0

  return {
    currentSectionData,
    currentSectionIndex,
    prevSectionIndex,
    currentScreenIndex,
  }
}

export const incrementWithScreens = (
  state: ApplicationState,
  currentSectionData: FormSystemSection,
  maxSectionIndex: number,
  currentScreenIndex: number,
  submitScreenMutation: MutationTuple<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    OperationVariables,
    DefaultContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ApolloCache<any>
  >,
): ApplicationState => {
  const screens = currentSectionData.screens ?? []
  const maxScreenIndex = screens.length - 1
  const [submitScreen] = submitScreenMutation
  const errors = validateScreen(state)
  if (errors.length > 0) {
    return {
      ...state,
      errors,
    }
  }

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

  if (currentScreenIndex === maxScreenIndex) {
    if (state.currentSection.index === maxSectionIndex) {
      return {
        ...state,
        errors: [],
      }
    }
    const nextSection = state.sections[state.currentSection.index + 1]
    return {
      ...state,
      currentSection: {
        index: state.currentSection.index + 1,
        data: nextSection,
      },
      currentScreen: hasScreens(nextSection)
        ? {
            index: 0,
            data: nextSection.screens
              ? (nextSection.screens[0] as FormSystemScreen)
              : undefined,
          }
        : undefined,
      errors: [],
    }
  } else {
    return {
      ...state,
      currentScreen: {
        data: screens[currentScreenIndex + 1] as FormSystemScreen,
        index: currentScreenIndex + 1,
      },
      errors: [],
    }
  }
}

export const incrementWithoutScreens = (
  state: ApplicationState,
  nextSectionIndex: number,
): ApplicationState => {
  const nextSection = state.sections[nextSectionIndex]
  return {
    ...state,
    currentSection: {
      data: nextSection,
      index: nextSectionIndex,
    },
    currentScreen: hasScreens(nextSection)
      ? {
          data: nextSection.screens?.[0] as FormSystemScreen,
          index: 0,
        }
      : undefined,
  }
}

export const decrementWithScreens = (
  state: ApplicationState,
  currentSectionData: FormSystemSection,
  currentSectionIndex: number,
  currentScreenIndex: number,
): ApplicationState => {
  const screens = currentSectionData.screens ?? []
  if (currentScreenIndex > 0) {
    return {
      ...state,
      currentScreen: {
        data: screens[currentScreenIndex - 1] as FormSystemScreen,
        index: currentScreenIndex - 1,
      },
      errors: [],
    }
  } else {
    if (currentSectionIndex === 0) {
      return state
    }
    const prevSection = state.sections[currentSectionIndex - 1]
    return {
      ...state,
      currentSection: {
        data: prevSection,
        index: currentSectionIndex - 1,
      },
      currentScreen: hasScreens(prevSection)
        ? {
            data: prevSection.screens
              ? (prevSection.screens[
                  prevSection.screens.length - 1
                ] as FormSystemScreen)
              : undefined,
            index: prevSection.screens ? prevSection.screens.length - 1 : 0,
          }
        : undefined,
      errors: [],
    }
  }
}

export const decrementWithoutScreens = (
  state: ApplicationState,
  currentSectionIndex: number,
): ApplicationState => {
  if (currentSectionIndex === 0) {
    return state
  }
  const prevSection = state.sections[currentSectionIndex - 1]
  return {
    ...state,
    currentSection: {
      data: prevSection,
      index: currentSectionIndex - 1,
    },
    currentScreen: hasScreens(prevSection)
      ? {
          data: prevSection.screens
            ? (prevSection.screens[
                prevSection.screens.length - 1
              ] as FormSystemScreen)
            : undefined,
          index: prevSection.screens ? prevSection.screens.length - 1 : 0,
        }
      : undefined,
    errors: [],
  }
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
  const updatedState = {
    ...state,
    currentScreen: {
      ...currentScreen,
      data: updatedScreen,
    },
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
    errors:
      state.errors && state.errors.length > 0
        ? validateScreen(updatedState)
        : [],
  }
}
