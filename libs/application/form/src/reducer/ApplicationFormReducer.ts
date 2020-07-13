import {
  FormLeaf,
  getFormLeaves,
  getSectionsInForm,
} from '@island.is/application/schema'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import { applyConditionsToFormFields, moveToScreen } from './reducerUtils'
import { merge } from 'lodash'

export function initializeReducer(
  state: ApplicationUIState,
): ApplicationUIState {
  const { form, formValue } = state
  const formLeaves: FormLeaf[] = getFormLeaves(form) // todo add conditions here to set isVisible: true/false
  const sections = getSectionsInForm(form)
  return {
    ...state,
    formLeaves,
    screens: applyConditionsToFormFields(formLeaves, formValue),
    sections,
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
      // eslint-disable-next-line no-case-declarations
      const newFormValue = merge(state.formValue, action.payload)
      return {
        ...state,
        formValue: newFormValue,
        screens: applyConditionsToFormFields(state.formLeaves, newFormValue),
      }
    default:
      return state
  }
}
