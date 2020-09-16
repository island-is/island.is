import {
  FormItemTypes,
  FormValue,
  mergeAnswers,
} from '@island.is/application/core'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import {
  convertFormToScreens,
  expandRepeater,
  findCurrentScreen,
  getNavigableSectionsInForm,
  moveToScreen,
} from './reducerUtils'
import { FormModes } from '../types'

export function initializeReducer(
  state: ApplicationUIState,
): ApplicationUIState {
  const { application, form } = state
  const { answers } = application
  const sections = getNavigableSectionsInForm(form, answers)
  const screens = convertFormToScreens(form, answers)
  const currentScreen =
    form.mode === FormModes.REVIEW ? 0 : findCurrentScreen(screens, answers)

  return moveToScreen(
    {
      ...state,
      screens,
      sections,
    },
    currentScreen,
    true,
  )
}

const addNewAnswersToState = (
  state: ApplicationUIState,
  answers: FormValue,
): ApplicationUIState => {
  const newAnswers = mergeAnswers(state.application.answers, answers)
  return {
    ...state,
    application: {
      ...state.application,
      answers: newAnswers,
    },
    sections: getNavigableSectionsInForm(state.form, newAnswers),
    screens: convertFormToScreens(state.form, newAnswers),
  }
}

const answerAndGoNextScreen = (
  state: ApplicationUIState,
  answers: FormValue,
): ApplicationUIState => {
  const newState = addNewAnswersToState(state, answers)
  const currentScreen = newState.screens[newState.activeScreen]
  const nextScreen =
    newState.screens[
      Math.min(newState.activeScreen + 1, newState.screens.length)
    ]
  if (currentScreen.type === FormItemTypes.REPEATER) {
    if (!currentScreen.repetitions) {
      return moveToScreen(newState, newState.activeScreen + 1, true)
    }
    return moveToScreen(
      newState,
      newState.activeScreen +
        currentScreen.repetitions * currentScreen.children.length +
        1,
      true,
    )
  }
  if (
    currentScreen.repeaterIndex !== undefined &&
    currentScreen.repeaterIndex >= 0 &&
    nextScreen.repeaterIndex === undefined
  ) {
    // go back to the initial repeater screen
    return moveToScreen(
      newState,
      newState.activeScreen - currentScreen.repeaterIndex - 1,
      true,
    )
  }
  return moveToScreen(newState, newState.activeScreen + 1, true)
}

export const ApplicationReducer = (
  state: ApplicationUIState,
  action: Action,
): ApplicationUIState => {
  const currentScreen = state.screens[state.activeScreen]
  const prevScreen = state.screens[Math.max(state.activeScreen - 1, 0)]

  switch (action.type) {
    case ActionTypes.ANSWER_AND_GO_NEXT_SCREEN:
      return answerAndGoNextScreen(state, action.payload)
    case ActionTypes.PREV_SCREEN:
      if (
        prevScreen.repeaterIndex !== undefined &&
        prevScreen.repeaterIndex >= 0 &&
        currentScreen.repeaterIndex === undefined
      ) {
        // go to the repeater index screen, TODO nested repeaters
        return moveToScreen(
          state,
          state.activeScreen - prevScreen.repeaterIndex - 1,
          false,
        )
      }
      return moveToScreen(state, state.activeScreen - 1, false)
    case ActionTypes.ANSWER:
      return addNewAnswersToState(state, action.payload)
    case ActionTypes.EXPAND_REPEATER:
      // eslint-disable-next-line no-case-declarations
      const newForm = expandRepeater(
        state.activeScreen,
        state.form,
        state.screens,
      )
      if (!newForm) {
        // the current screen is not a repeater
        return state
      }
      return moveToScreen(
        {
          ...state,
          form: newForm,
          screens: convertFormToScreens(newForm, state.application.answers),
        },
        state.activeScreen +
          (currentScreen.type === FormItemTypes.REPEATER
            ? currentScreen.repetitions * currentScreen.children.length
            : 0) +
          1,
        true,
      )
    case ActionTypes.ADD_EXTERNAL_DATA:
      return {
        ...state,
        application: {
          ...state.application,
          externalData: {
            ...state.application.externalData,
            ...action.payload,
          },
        },
      }
    default:
      return state
  }
}
