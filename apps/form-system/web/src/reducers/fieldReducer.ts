import { Action, ApplicationState } from "@island.is/form-system/ui"
import { setFieldValue } from "./reducerUtils"

export const fieldReducer = (
  state: ApplicationState,
  action: Action
): ApplicationState => {
  switch (action.type) {
    case 'SET_LIST_VALUE': {
      const { value, id } = action.payload
      return setFieldValue(state, 'listValue', id, value)
    }
    case 'SET_CHECKBOX_VALUE': {
      const { value, id } = action.payload
      return setFieldValue(state, 'checkboxValue', id, value)
    }
    case 'SET_BANK_ACCOUNT': {
      const { value, id } = action.payload
      return setFieldValue(state, 'bankAccount', id, value)
    }
    default:
      return state
  }
}