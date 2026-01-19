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

const completeSection = (
  sections: FormSystemSection[],
  idx: number,
  completed = true,
) => sections.map((s, i) => (i === idx ? { ...s, isCompleted: completed } : s))

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

  submitScreen({
    variables: {
      input: {
        submitScreenDto: {
          applicationId: state.application.id,
          screenId: state.currentScreen?.data?.id,
          sectionId: state.currentSection.data.id,
          increment: true,
          sections: state.sections,
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
  submitScreenMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const [submitScreen] = submitScreenMutation

  submitScreen({
    variables: {
      input: {
        submitScreenDto: {
          applicationId: state.application.id,
          screenId: state.currentScreen?.data?.id,
          sectionId: state.currentSection.data.id,
          increment: true,
          sections: state.sections,
        },
      },
    },
  }).catch((error) => {
    console.error('Error submitting screen:', error)
  })

  const sections = state.sections ?? []
  const leavingIdx = state.currentSection.index
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

export const decrement = (
  state: ApplicationState,
  currentSectionIndex: number,
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

  state.currentScreen = setCurrentScreen(
    state,
    currentSectionIndex,
    currentScreenIndex,
  ).currentScreen

  state.currentSection = setCurrentScreen(
    state,
    currentSectionIndex,
    currentScreenIndex,
  ).currentSection

  submitScreen({
    variables: {
      input: {
        submitScreenDto: {
          applicationId: state.application.id,
          screenId: state.currentScreen?.data?.id,
          sectionId: state.currentSection.data.id,
          increment: false,
          sections: state.sections,
        },
      },
    },
  }).catch((error) => {
    console.error('Error decrementing screen:', error)
  })
  if (
    updateDependencies &&
    state.currentSection.data.sectionType === SectionTypes.INPUT
  ) {
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

  let resultSections = state.sections ?? []
  let resultCurrentScreen = state.currentScreen
  let resultCurrentSection = state.currentSection
  const sections = state.sections ?? []
  const doesSectionHaveScreens = hasScreens(
    state.sections?.[currentSectionIndex],
  )
  const isFirstScreenInSection =
    doesSectionHaveScreens &&
    prevVisibleScreenInSection(
      state.currentSection.data,
      currentScreenIndex,
    ) === -1

  if (doesSectionHaveScreens && !isFirstScreenInSection) {
    const prevScreenIdx = prevVisibleScreenInSection(
      state.currentSection.data,
      currentScreenIndex,
    )
    resultCurrentScreen =
      prevScreenIdx >= 0
        ? {
            data: state.currentSection.data.screens![
              prevScreenIdx
            ] as FormSystemScreen,
            index: prevScreenIdx,
          }
        : undefined
  } else if (
    !doesSectionHaveScreens ||
    (doesSectionHaveScreens && isFirstScreenInSection)
  ) {
    const prevSectionIdx = prevVisibleSectionIndex(
      sections,
      currentSectionIndex,
    )
    if (prevSectionIdx !== -1) {
      const prevSection = sections[prevSectionIdx]
      resultSections = completeSection(resultSections, prevSectionIdx, false)
      resultCurrentSection = { data: prevSection, index: prevSectionIdx }

      if (hasScreens(prevSection) === true) {
        const lastScreenIdx = lastVisibleScreenIndex(prevSection.screens)
        resultCurrentSection = { data: prevSection, index: prevSectionIdx }
        resultCurrentScreen =
          lastScreenIdx >= 0
            ? {
                data: prevSection.screens![lastScreenIdx] as FormSystemScreen,
                index: lastScreenIdx,
              }
            : undefined
      } else {
        resultCurrentScreen = undefined
      }
    }
  }
  return {
    ...state,
    currentSection: resultCurrentSection,
    currentScreen: resultCurrentScreen,
    sections: resultSections,
    errors: [],
  }
}

export const jumpToScreen = (
  state: ApplicationState,
  sectionIndex: number,
  screenIndex: number,
  updateCompletedMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
): ApplicationState => {
  const [updateCompleted] = updateCompletedMutation
  const sections = state.sections ?? []
  if (sectionIndex < 0 || sectionIndex >= sections.length) {
    return state
  }

  // Reset isCompleted for sections and screens starting from sectionIndex
  const updatedSections = sections.map((section, idx) => {
    if (idx < sectionIndex) return section

    const updatedScreens = Array.isArray(section.screens)
      ? section.screens.map((screen, sIdx) =>
          screen
            ? idx > sectionIndex || sIdx > screenIndex
              ? ({ ...screen, isCompleted: false } as FormSystemScreen)
              : screen
            : null,
        )
      : section.screens

    return {
      ...section,
      isCompleted: false,
      screens: updatedScreens,
    } as FormSystemSection
  })

  // Collect IDs to remove from application.completed
  const idsToRemove: string[] = []
  for (let i = sectionIndex; i < sections.length; i++) {
    const sec = sections[i]
    if (sec?.id != null) {
      idsToRemove.push(sec.id)
    }
    const scrs = sec?.screens ?? []
    for (let sIdx = 0; sIdx < scrs.length; sIdx++) {
      const sc = scrs[sIdx]
      if (sc?.id != null) {
        if (i > sectionIndex || sIdx >= screenIndex) {
          idsToRemove.push(sc.id)
        }
      }
    }
  }

  updateCompleted({
    variables: {
      input: {
        id: state.application.id,
        updateApplicationDto: {
          completed: idsToRemove,
        },
      },
    },
  }).catch((error) => {
    console.error('Error updating dependencies:', error)
  })

  return {
    ...state,
    sections: updatedSections,
    application: {
      ...state.application,
    },
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
