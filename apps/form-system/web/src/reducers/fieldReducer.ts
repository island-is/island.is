import { Action, ApplicationState } from '@island.is/form-system/ui'
import { setFieldValue } from './reducerUtils'

//TODO: You could create a map between the action type and field type value, since most of these call the same function just with different "type". Then you you could combine most of these cases, exempt the date one
export const fieldReducer = (
  state: ApplicationState,
  action: Action,
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
    case 'SET_CURRENCY': {
      const { value, id } = action.payload
      return setFieldValue(state, 'iskNumber', id, value)
    }
    case 'SET_EMAIL': {
      const { value, id } = action.payload
      return setFieldValue(state, 'email', id, value)
    }
    case 'SET_NATIONAL_ID': {
      const { value, id } = action.payload
      return setFieldValue(state, 'nationalId', id, value)
    }
    case 'SET_PHONE_NUMBER': {
      const { value, id } = action.payload
      return setFieldValue(state, 'phoneNumber', id, value)
    }
    case 'SET_TEXT': {
      const { value, id } = action.payload
      return setFieldValue(state, 'text', id, value)
    }
    case 'SET_DATE': {
      const { value, id } = action.payload
      return setFieldValue(state, 'date', id, new Date(value))
    }
    case 'SET_PROPERTY_NUMBER': {
      const { value, id } = action.payload
      return setMultipleFieldValues(state, id, value)
    }
    default:
      return state
  }
}

const setMultipleFieldValues = (
  state: ApplicationState,
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>,
): ApplicationState => {
  return Object.entries(values).reduce(
    (acc, [fieldName, fieldValue]) =>
      setFieldValue(acc, fieldName, id, fieldValue),
    state,
  )
}
