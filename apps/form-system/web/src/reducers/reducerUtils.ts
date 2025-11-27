import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { ApplicationState, SectionTypes } from '@island.is/form-system/ui'
import {
  firstVisibleScreenIndex,
  hasScreens,
  lastVisibleScreenIndex,
  nextVisibleScreenInSection,
  nextVisibleSectionIndex,
  prevVisibleScreenInSection,
  prevVisibleSectionIndex,
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

const completeSection = (sections: FormSystemSection[], idx: number) =>
  sections.map((s, i) => (i === idx ? { ...s, isCompleted: true } : s))

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
  updateDependenciesMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const [submitScreen] = submitScreenMutation
  const [updateDependencies] = updateDependenciesMutation
  const errors = state.errors ?? []
  const isValid = state.isValid ?? true

  if (errors.length > 0 || !isValid) {
    return { ...state, errors }
  }

  if (
    currentSectionData.sectionType === SectionTypes.INPUT ||
    currentSectionData.sectionType === SectionTypes.PARTIES
  ) {
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
    if (currentSectionData.sectionType === SectionTypes.INPUT) {
      updateDependencies({
        variables: {
          input: {
            id: state.application.id,
            updateApplicationDto: {
              dependencies: state.application.dependencies,
            },
          },
        },
      }).catch((error) => {
        console.error('Error updating dependencies:', error)
      })
    }
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
    sections: completeSection(sections, curSecIdx),
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
  const leavingIdx = state.currentSection.index
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
  if (nextSecIdx === -1) {
    return {
      ...state,
      sections: completeSection(sections, leavingIdx),
      errors: [],
    }
  }
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
    sections: completeSection(sections, leavingIdx),
    errors: [],
  }
}

export const decrementWithScreens = (
  state: ApplicationState,
  currentSectionIndex: number,
  currentScreenIndex: number,
  submitScreenMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const sections = state.sections ?? []
  const section = sections[currentSectionIndex] as FormSystemSection | undefined

  const [submitScreen] = submitScreenMutation

  const prevScreenIdx = prevVisibleScreenInSection(section, currentScreenIndex)
  if (prevScreenIdx !== -1) {
    const prevScreen = section!.screens![prevScreenIdx] as FormSystemScreen

    // Set current screen as completed to false before decrementing
    submitScreen({
      variables: {
        input: {
          screenId: state.currentScreen?.data?.id,
          submitScreenDto: {
            applicationId: state.application.id,
            screenDto: {
              ...state.currentScreen?.data,
              isCompleted: false,
            } as FormSystemScreen,
          },
        },
      },
    }).catch((error) => {
      console.error('Error submitting screen:', error)
    })

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
