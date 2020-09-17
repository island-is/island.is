import {
  FormItemTypes,
  FormLeaf,
  FormValue,
  getApplicationStateInformation,
  getApplicationTemplateByTypeId,
  getFormLeaves,
  getSectionsInForm,
  mergeAnswers,
} from '@island.is/application/template'
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
  const { application } = state
  const { answers, typeId } = application
  const template = getApplicationTemplateByTypeId(typeId)
  let form
  if (state.form) {
    form = state.form
  } else {
    const state = getApplicationStateInformation(application)
    if (state?.roles?.length) {
      // TODO later map this to current role
      form = state.roles[0].form
    }
  }
  const formLeaves: FormLeaf[] = getFormLeaves(form) // todo add conditions here to set isVisible: true/false
  const sections = getSectionsInForm(form)
  const screens = convertLeavesToScreens(formLeaves, answers)
  const currentScreen =
    form.formMode === 'review' ? 0 : findCurrentScreen(screens, answers)

  return moveToScreen(
    {
      ...state,
      dataSchema: state.dataSchema || template.dataSchema,
      form,
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
  const newAnswers = mergeAnswers(state.application.answers, answers)
  return {
    ...state,
    application: {
      ...state.application,
      answers: newAnswers,
    },
    screens: convertLeavesToScreens(state.formLeaves, newAnswers),
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
        state.application.answers,
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
