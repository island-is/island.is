import { FormSystemScreen, FormSystemSection } from "@island.is/api/schema"
import { Action, ApplicationState } from "./reducerTypes"

export const initialReducer = (
  state: ApplicationState
): ApplicationState => {
  const { application } = state
  const { completed } = application
  // need to implement logic on getting current section and screen when loading the application
  const sectionId = application.sections && application.sections[0] ? application.sections[0].id : null
  const sections = (application.sections ?? []).filter((section): section is FormSystemSection => section !== null)
  const screens = sections.filter((section) => section !== null && section.screens && section.screens.length > 0).map((section) => section?.screens).flat().filter((screen): screen is FormSystemScreen => screen !== undefined) ?? []
  return {
    ...state,
    sections,
    screens,
    currentSection: sectionId ?? '',
  }
}

export const applicationReducer = (
  state: ApplicationState,
  action: Action
): ApplicationState => {
  switch (action.type) {

    default:
      return state
  }
}