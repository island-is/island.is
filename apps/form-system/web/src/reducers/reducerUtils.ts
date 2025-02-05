import { FormSystemSection } from "@island.is/api/schema"
import { ApplicationState, Action } from "./reducerTypes"

export const hasScreens = (section: FormSystemSection): boolean => {
  return Boolean(section.screens && section.screens.length > 0)
}


export const getVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]
  const maxSectionIndex = sections.length - 1
  const nextSectionIndex =
    currentSectionIndex < maxSectionIndex ? currentSectionIndex + 1 : maxSectionIndex
  const currentScreenIndex = hasScreens(currentSectionData) ? (currentScreen?.index ?? 0) : 0

  return { currentSectionData, maxSectionIndex, nextSectionIndex, currentScreenIndex }
}

export const getDecrementVariables = (state: ApplicationState) => {
  const { sections, currentSection, currentScreen } = state
  const currentSectionIndex = currentSection.index
  const currentSectionData = sections[currentSectionIndex]
  const prevSectionIndex = currentSectionIndex > 0 ? currentSectionIndex - 1 : 0
  const currentScreenIndex = hasScreens(currentSectionData)
    ? (currentScreen?.index ?? 0)
    : 0

  return { currentSectionData, currentSectionIndex, prevSectionIndex, currentScreenIndex }
}

export const incrementWithScreens = (
  state: ApplicationState,
  currentSectionData: FormSystemSection,
  maxSectionIndex: number,
  currentScreenIndex: number
): ApplicationState => {
  const screens = currentSectionData.screens ?? []
  const maxScreenIndex = screens.length - 1

  if (currentScreenIndex === maxScreenIndex) {
    if (state.currentSection.index === maxSectionIndex) {
      return state
    }

    const nextSection = state.sections[state.currentSection.index + 1]
    return {
      ...state,
      currentSection: {
        id: nextSection.id ?? '',
        index: state.currentSection.index + 1,
      },
      currentScreen: hasScreens(nextSection)
        ? {
          id: nextSection.screens?.[0]?.id ?? '',
          index: 0,
        }
        : undefined,
    }
  } else {
    return {
      ...state,
      currentScreen: {
        id: screens[currentScreenIndex + 1]?.id ?? '',
        index: currentScreenIndex + 1,
      },
    }
  }
}

export const incrementWithoutScreens = (
  state: ApplicationState,
  nextSectionIndex: number
): ApplicationState => {
  const nextSection = state.sections[nextSectionIndex]
  return {
    ...state,
    currentSection: {
      id: nextSection.id ?? '',
      index: nextSectionIndex,
    },
    currentScreen: hasScreens(nextSection)
      ? {
        id: nextSection.screens?.[0]?.id ?? '',
        index: 0,
      }
      : undefined,
  }
}

export const decrementWithScreens = (
  state: ApplicationState,
  currentSectionData: FormSystemSection,
  currentSectionIndex: number,
  currentScreenIndex: number
): ApplicationState => {
  const screens = currentSectionData.screens ?? []
  if (currentScreenIndex > 0) {
    return {
      ...state,
      currentScreen: {
        id: screens[currentScreenIndex - 1]?.id ?? '',
        index: currentScreenIndex - 1,
      },
    }
  } else {
    if (currentSectionIndex === 0) {
      return state
    }
    const prevSection = state.sections[currentSectionIndex - 1]
    return {
      ...state,
      currentSection: {
        id: prevSection.id ?? '',
        index: currentSectionIndex - 1,
      },
      currentScreen: hasScreens(prevSection)
        ? {
          id: prevSection.screens ? prevSection.screens[prevSection.screens.length - 1]?.id ?? '' : '',
          index: prevSection.screens ? prevSection.screens.length - 1 : 0,
        }
        : undefined,
    }
  }
}

export const decrementWithoutScreens = (
  state: ApplicationState,
  currentSectionIndex: number
): ApplicationState => {
  if (currentSectionIndex === 0) {
    return state
  }
  const prevSection = state.sections[currentSectionIndex - 1]
  return {
    ...state,
    currentSection: {
      id: prevSection.id ?? '',
      index: currentSectionIndex - 1,
    },
    currentScreen: hasScreens(prevSection)
      ? {
        id: prevSection.screens ? prevSection.screens[prevSection.screens.length - 1]?.id ?? '' : '',
        index: prevSection.screens ? prevSection.screens.length - 1 : 0,
      }
      : undefined,
  }
}