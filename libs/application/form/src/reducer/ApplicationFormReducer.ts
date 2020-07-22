import {
  FormLeaf,
  getFormLeaves,
  getSectionsInForm,
} from '@island.is/application/schema'
import { Action, ActionTypes, ApplicationUIState } from './ReducerTypes'
import { applyConditionsToFormFields, moveToScreen } from './reducerUtils'
import { mergeWith, isArray } from 'lodash'

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
      const newFormValue = mergeWith(
        state.formValue,
        action.payload,
        mergeCustomizer,
      )
      return {
        ...state,
        formValue: newFormValue,
        screens: applyConditionsToFormFields(state.formLeaves, newFormValue),
      }
    default:
      return state
  }
}
