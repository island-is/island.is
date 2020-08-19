import {
  FormItemTypes,
  FormLeaf,
  getFormLeaves,
  getSectionsInForm,
} from '@island.is/application/schema'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import {
  convertLeavesToScreens,
  expandRepeater,
  findCurrentScreen,
  moveToScreen,
} from './reducerUtils'

/*
  Makes it so that lodash merge only uses the newer array.
  For example: A user answers a checkbox question: ['VW', 'Tesla'],
  then they go back and change it to ['Audi']. We want the answer to
  be the newer version, not ['Audi', 'VW', 'Tesla']
*/
const mergeCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return srcValue
  }
}

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
  )
}

export const ApplicationReducer = (
  state: ApplicationUIState,
  action: Action,
): ApplicationUIState => {
  const currentScreen = state.screens[state.activeScreen]
  const nextScreen =
    state.screens[Math.min(state.activeScreen + 1, state.screens.length)]
  const prevScreen = state.screens[Math.max(state.activeScreen - 1, 0)]
  switch (action.type) {
    case ActionTypes.NEXT_SCREEN:
      if (currentScreen.type === FormItemTypes.REPEATER) {
        if (!currentScreen.repetitions) {
          return moveToScreen(state, state.activeScreen + 1)
        }
        return moveToScreen(
          state,
          state.activeScreen +
            currentScreen.repetitions * currentScreen.children.length +
            1,
        )
      }
      if (
        currentScreen.repeaterIndex >= 0 &&
        nextScreen.repeaterIndex === undefined
      ) {
        return moveToScreen(state, currentScreen.repeaterIndex)
      }
      return moveToScreen(state, state.activeScreen + 1)
    case ActionTypes.PREV_SCREEN:
      if (
        prevScreen.repeaterIndex >= 0 &&
        currentScreen.repeaterIndex === undefined
      ) {
        return moveToScreen(state, prevScreen.repeaterIndex)
      }
      return moveToScreen(state, state.activeScreen - 1)
    case ActionTypes.ANSWER:
      // eslint-disable-next-line no-case-declarations
      const newFormValue = mergeWith(
        state.formValue,
        action.payload,
        mergeCustomizer,
      )
      return {
        ...state,
        formValue: newFormValue,
        screens: convertLeavesToScreens(state.formLeaves, newFormValue),
      }
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
      )
    default:
      return state
  }
}
