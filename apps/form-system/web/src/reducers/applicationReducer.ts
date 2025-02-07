import { FormSystemScreen, FormSystemSection } from "@island.is/api/schema"
import { Action, ApplicationState } from "./reducerTypes"
import { decrementWithoutScreens, decrementWithScreens, getDecrementVariables, getIncrementVariables, hasScreens, incrementWithoutScreens, incrementWithScreens } from "./reducerUtils"

export const initialReducer = (
  state: ApplicationState
): ApplicationState => {
  const { application } = state
  const { completed } = application
  //TODO: need to implement logic on getting current section and screen when loading the application
  const sectionId = application.sections && application.sections[0] ? application.sections[0].id : null
  const sections = (application.sections ?? []).filter(Boolean) as FormSystemSection[]
  const screens = sections.flatMap(section => section.screens ?? []).filter(Boolean) as FormSystemScreen[]

  return {
    ...state,
    sections,
    screens,
    currentSection: {
      id: sectionId ?? '',
      index: 0
    },
  }
}

export const applicationReducer = (
  state: ApplicationState,
  action: Action
): ApplicationState => {
  switch (action.type) {
    case 'INCREMENT': {
      const { currentSectionData, maxSectionIndex, nextSectionIndex, currentScreenIndex } =
        getIncrementVariables(state)

      if (hasScreens(currentSectionData)) {
        return incrementWithScreens(state, currentSectionData, maxSectionIndex, currentScreenIndex)
      }

      return incrementWithoutScreens(state, nextSectionIndex)
    }
    case 'DECREMENT': {
      const { currentSectionData, currentSectionIndex, currentScreenIndex } =
        getDecrementVariables(state)

      if (hasScreens(currentSectionData)) {
        return decrementWithScreens(state, currentSectionData, currentSectionIndex, currentScreenIndex)
      }

      return decrementWithoutScreens(state, currentSectionIndex)
    }
    default:
      return state
  }
}