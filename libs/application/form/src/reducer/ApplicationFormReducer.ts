import {
  FormItemTypes,
  FormLeaf,
  FormValue,
  getFormLeaves,
  getSectionsInForm,
  mergeNestedObjects,
} from '@island.is/application/schema'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import {
  convertLeavesToScreens,
  expandRepeater,
  findCurrentScreen,
  moveToScreen,
} from './reducerUtils'

export function initializeReducer(
  state: ApplicationUIState,
): ApplicationUIState {
  const { form, formValue } = state
  const formLeaves: FormLeaf[] = getFormLeaves(form) // todo add conditions here to set isVisible: true/false
  const sections = getSectionsInForm(form)
  const screens = convertLeavesToScreens(formLeaves, formValue)
  const currentScreen = findCurrentScreen(screens, formValue)

  return moveToScreen(
    {
      ...state,
      formLeaves,
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
  const newFormValue = mergeNestedObjects(state.formValue, answers)
  return {
    ...state,
    formValue: newFormValue,
    screens: convertLeavesToScreens(state.formLeaves, newFormValue),
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
    currentScreen.repeaterIndex >= 0 &&
    nextScreen.repeaterIndex === undefined
  ) {
    return moveToScreen(newState, currentScreen.repeaterIndex, true)
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
        prevScreen.repeaterIndex >= 0 &&
        currentScreen.repeaterIndex === undefined
      ) {
        return moveToScreen(state, prevScreen.repeaterIndex, false)
      }
      return moveToScreen(state, state.activeScreen - 1, false)
    case ActionTypes.ANSWER:
      return addNewAnswersToState(state, action.payload)
    case ActionTypes.EXPAND_REPEATER:
      // eslint-disable-next-line no-case-declarations
      const [newFormLeaves, newScreens] = expandRepeater(
        state.activeScreen,
        state.formLeaves,
        state.screens,
        state.formValue,
      )
      if (!newFormLeaves) {
        // the current screen is not a repeater
        return state
      }
      return moveToScreen(
        {
          ...state,
          formLeaves: newFormLeaves,
          screens: newScreens,
        },
        state.activeScreen +
          (currentScreen.type === FormItemTypes.REPEATER
            ? currentScreen.repetitions * currentScreen.children.length
            : 0) +
          1,
        false,
      )
    case ActionTypes.RE_INITIALIZE:
      return initializeReducer({ ...state, ...action.payload })
    default:
      return state
  }
}
