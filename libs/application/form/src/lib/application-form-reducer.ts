import {
  Form,
  FormScreen,
  Section,
  findSectionIndexForScreen,
  findSubSectionIndexForScreen,
  getScreensForForm,
  getSectionsInForm,
  getSubSectionsInSection,
} from '@island.is/application/schema'

export function initializeReducer(
  state: ApplicationUIState,
): ApplicationUIState {
  const { form } = state
  const screens = getScreensForForm(form)
  const sections = getSectionsInForm(form)
  return {
    ...state,
    screens,
    sections,
  }
}

// TODO how should we type this?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Answers {}

export interface ApplicationUIState {
  answers: Answers
  form: Form
  activeSection: number
  activeSubSection: number
  activeScreen: number
  screens: FormScreen[]
  sections: Section[]
}

export enum ActionTypes {
  ANSWER = 'ANSWER',
  NEXT_SCREEN = 'NEXT_SCREEN',
  PREV_SCREEN = 'PREV_SCREEN',
}

export interface Action {
  type: ActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

const moveToScreen = (
  state: ApplicationUIState,
  screenIndex: number,
): ApplicationUIState => {
  const { form, sections, screens } = state

  if (screenIndex < 0) {
    return { ...state, activeScreen: 0, activeSection: 0, activeSubSection: 0 }
  }
  if (screenIndex === screens.length) {
    const subSections = getSubSectionsInSection(sections[sections.length - 1])
    return {
      ...state,
      activeScreen: screens.length - 1,
      activeSection: sections.length - 1,
      activeSubSection: subSections.length ? subSections.length - 1 : 0,
    }
  }

  const screen = screens[screenIndex]
  const sectionIndexForScreen = findSectionIndexForScreen(form, screen)

  const subSectionIndexForScreen = findSubSectionIndexForScreen(
    sections[sectionIndexForScreen],
    screen,
  )

  return {
    ...state,
    activeScreen: screenIndex,
    activeSection: sectionIndexForScreen,
    activeSubSection: subSectionIndexForScreen,
  }
}

export const ApplicationReducer = (
  state: ApplicationUIState,
  action: Action,
): ApplicationUIState => {
  switch (action.type) {
    case ActionTypes.NEXT_SCREEN:
      return moveToScreen(state, state.activeScreen + 1)
    case ActionTypes.PREV_SCREEN:
      return moveToScreen(state, state.activeScreen - 1)
    case ActionTypes.ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.id]: action.payload.answer,
        },
      }
    default:
      return state
  }
}
