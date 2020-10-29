import {
  FormItemTypes,
  FormModes,
  FormValue,
  getValueViaPath,
  mergeAnswers,
} from '@island.is/application/core'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import {
  convertFormToScreens,
  findCurrentScreen,
  getNavigableSectionsInForm,
  moveToScreen,
} from './reducerUtils'
import { FormScreen } from '@island.is/application/ui-shell'

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
    const repeatedItems = (newState.application.answers[currentScreen.id] ??
      []) as unknown[]
    return moveToScreen(
      newState,
      newState.activeScreen +
        repeatedItems.length * currentScreen.children.length +
        1,
      true,
    )
  }
  if (currentScreen.isPartOfRepeater && !nextScreen.isPartOfRepeater) {
    // go back to the initial repeater screen
    return moveToScreen(
      newState,
      findNearestRepeater(newState.activeScreen, newState.screens),
      true,
    )
  }
  return moveToScreen(newState, newState.activeScreen + 1, true)
}

function expandRepeater(state: ApplicationUIState): ApplicationUIState {
  const { activeScreen, form, screens, application } = state
  const repeater = screens[activeScreen]
  if (!repeater || repeater.type !== FormItemTypes.REPEATER) {
    return state
  }
  const { answers } = application
  const repeaterValues = getValueViaPath(
    answers ?? {},
    repeater.id,
    [],
  ) as unknown[]

  // we add an empty object to the repeater array to ensure that new screens will be added
  const newAnswers = mergeAnswers(answers, {
    [repeater.id]: [...repeaterValues, {}],
  })
  return moveToScreen(
    {
      ...state,
      screens: convertFormToScreens(form, newAnswers),
    },
    state.activeScreen + repeaterValues.length * repeater.children.length + 1,
    true,
  )
}

function findNearestRepeater(
  activeScreen: number,
  screens: FormScreen[],
): number {
  let repeaterIndex = activeScreen - 1
  for (repeaterIndex; repeaterIndex >= 0; repeaterIndex--) {
    if (screens[repeaterIndex].type === FormItemTypes.REPEATER) {
      break
    }
  }
  return repeaterIndex
}

export const ApplicationReducer = (
  state: ApplicationUIState,
  action: Action,
): ApplicationUIState => {
  const prevScreen = state.screens[Math.max(state.activeScreen - 1, 0)]

  switch (action.type) {
    case ActionTypes.ANSWER_AND_GO_NEXT_SCREEN:
      return answerAndGoNextScreen(state, action.payload)
    case ActionTypes.PREV_SCREEN:
      if (prevScreen.isPartOfRepeater) {
        // go to the repeater index screen, TODO nested repeaters
        return moveToScreen(
          state,
          findNearestRepeater(state.activeScreen, state.screens),
          false,
        )
      }
      return moveToScreen(state, state.activeScreen - 1, false)
    case ActionTypes.ANSWER:
      return addNewAnswersToState(state, action.payload)
    case ActionTypes.EXPAND_REPEATER:
      return expandRepeater(state)
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
