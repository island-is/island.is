import { getValueViaPath, mergeAnswers } from '@island.is/application/core'
import {
  FormItemTypes,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import {
  convertFormToScreens,
  findCurrentScreen,
  getNavigableSectionsInForm,
  moveToScreen,
} from './reducerUtils'
import { FormScreen } from '../types'

export function initializeReducer(
  state: ApplicationUIState,
): ApplicationUIState {
  const { application, form } = state
  const { answers, externalData } = application
  const sections = getNavigableSectionsInForm(
    form,
    answers,
    externalData,
    state.user,
  )
  const screens = convertFormToScreens(form, answers, externalData, state.user)
  const currentScreen =
    form.mode === FormModes.IN_PROGRESS
      ? 0
      : findCurrentScreen(screens, answers)

  return {
    ...state,
    screens,
    sections,
    activeScreen: moveToScreen(screens, currentScreen, true),
  }
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
    sections: getNavigableSectionsInForm(
      state.form,
      newAnswers,
      state.application.externalData,
      state.user,
    ),
    screens: convertFormToScreens(
      state.form,
      newAnswers,
      state.application.externalData,
      state.user,
    ),
  }
}

const goToSpecificScreen = (
  state: ApplicationUIState,
  screenId: string,
): ApplicationUIState => {
  const { screens } = state
  let activeScreen = state.activeScreen
  screens.forEach(({ id }, index) => {
    if (id === screenId) {
      activeScreen = index
      return false
    }
  })

  return {
    ...state,
    activeScreen,
    historyReason: 'navigate',
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

  let activeScreen: number

  if (currentScreen.type === FormItemTypes.REPEATER) {
    const repeatedItems = (newState.application.answers[currentScreen.id] ??
      []) as unknown[]

    activeScreen = moveToScreen(
      newState.screens,
      newState.activeScreen +
        repeatedItems.length * currentScreen.children.length +
        1,
      true,
    )
  } else if (currentScreen.isPartOfRepeater && !nextScreen.isPartOfRepeater) {
    // go back to the initial repeater screen
    activeScreen = moveToScreen(
      newState.screens,
      findNearestRepeater(newState.activeScreen, newState.screens),
      true,
    )
  } else {
    activeScreen = moveToScreen(
      newState.screens,
      newState.activeScreen + 1,
      true,
    )
  }

  return { ...newState, activeScreen, historyReason: 'navigate' }
}

function expandRepeater(state: ApplicationUIState): ApplicationUIState {
  const { activeScreen, form, screens, application } = state
  const repeater = screens[activeScreen]

  if (!repeater || repeater.type !== FormItemTypes.REPEATER) {
    return state
  }

  const { answers, externalData } = application
  const repeaterValues = getValueViaPath(
    answers ?? {},
    repeater.id,
    [],
  ) as unknown[]

  // we add an empty object to the repeater array to ensure that new screens will be added
  const newAnswers = mergeAnswers(answers, {
    [repeater.id]: [...repeaterValues, {}],
  })

  const newScreens = convertFormToScreens(
    form,
    newAnswers,
    externalData,
    state.user,
  )

  return {
    ...state,
    screens: newScreens,
    activeScreen: moveToScreen(
      newScreens,
      state.activeScreen + repeaterValues.length * repeater.children.length + 1,
      true,
    ),
    historyReason: 'navigate',
  }
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
        return {
          ...state,
          activeScreen: moveToScreen(
            state.screens,
            findNearestRepeater(state.activeScreen, state.screens),
            false,
          ),
          historyReason: 'navigate',
        }
      }
      return {
        ...state,
        activeScreen: moveToScreen(
          state.screens,
          state.activeScreen - 1,
          false,
        ),
        historyReason: 'navigate',
      }

    case ActionTypes.ANSWER:
      return addNewAnswersToState(state, action.payload)

    case ActionTypes.EXPAND_REPEATER:
      return expandRepeater(state)

    case ActionTypes.GO_TO_SCREEN:
      return goToSpecificScreen(state, action.payload)

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

    case ActionTypes.HISTORY_POP:
      return {
        ...state,
        activeScreen: action.payload.screen,
        historyReason: 'pop',
      }

    default:
      return state
  }
}
