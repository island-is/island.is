import { Action, ApplicationState } from '@island.is/form-system/ui'
import { setFieldValue } from './fieldReducerUtils'
import { setError } from './reducerUtils'
import {
  FormSystemListItem,
  FormSystemLanguageType,
} from '@island.is/api/schema'

export const fieldReducer = (
  state: ApplicationState,
  action: Action,
): ApplicationState => {
  switch (action.type) {
    case 'SET_LIST_VALUE': {
      const { id, value, valueIndex } = action.payload
      const values = {
        label: value?.label,
        value: value?.value,
      }
      return setMultipleFieldValues(state, id, values, valueIndex)
    }
    case 'SET_CHECKBOX_VALUE': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'checkboxValue', id, value, valueIndex)
    }
    case 'SET_BANK_ACCOUNT': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'bankAccount', id, value, valueIndex)
    }
    case 'SET_CURRENCY': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'iskNumber', id, value, valueIndex)
    }
    case 'SET_EMAIL': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'email', id, value, valueIndex)
    }
    case 'SET_NATIONAL_ID': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'nationalId', id, value, valueIndex)
    }
    case 'SET_PHONE_NUMBER': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'phoneNumber', id, value, valueIndex)
    }
    case 'SET_TEXT': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'text', id, value, valueIndex)
    }
    case 'SET_NUMBER': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'number', id, value, valueIndex)
    }
    case 'SET_DATE': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(
        state,
        'date',
        id,
        value ? new Date(value) : null,
        valueIndex,
      )
    }
    // case 'SET_PROPERTY_NUMBER': {
    //   const { value, id } = action.payload
    //   return setMultipleFieldValues(state, id, value)
    // }
    case 'SET_TIME': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'time', id, value, valueIndex)
    }
    case 'SET_FIELD_ERROR': {
      const { fieldId, hasError } = action.payload
      return setError(state, fieldId, hasError)
    }
    case 'SET_NAME': {
      const { value, id, valueIndex } = action.payload
      return setFieldValue(state, 'name', id, value, valueIndex)
    }
    case 'SET_ADDRESS': {
      const { address, postalCode, id } = action.payload
      const value = {
        address: address,
        postalCode: postalCode,
      }

      return setMultipleFieldValues(state, id, value)
    }
    case 'SET_FILES': {
      const { value, id } = action.payload
      return setFieldValue(state, 's3Key', id, value)
    }
    case 'SET_PAYMENT_QUANTITY': {
      const { value, id } = action.payload
      return setFieldValue(state, 'number', id, value)
    }
    case 'SET_FIELD_LIST': {
      const { id, list, placeholder } = action.payload
      return setFieldList(state, id, list, placeholder)
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
  valueIndex?: number,
): ApplicationState => {
  return Object.entries(values).reduce(
    (acc, [fieldName, fieldValue]) =>
      setFieldValue(acc, fieldName, id, fieldValue, valueIndex),
    state,
  )
}

const setFieldList = (
  state: ApplicationState,
  fieldId: string,
  list: FormSystemListItem[],
  placeholder?: FormSystemLanguageType | null | undefined,
): ApplicationState => {
  const currentScreen = state.currentScreen
  if (!currentScreen?.data) return state

  const screen = currentScreen.data
  const updatedScreen = {
    ...screen,
    fields: screen.fields?.map((f) => (f?.id === fieldId ? { ...f, list } : f)),
  }

  const updatedSections = state.sections.map((section) => ({
    ...section,
    screens: section.screens?.map((s) =>
      s?.id === updatedScreen.id ? updatedScreen : s,
    ),
  }))

  return {
    ...state,
    externalListPlaceholders: [
      ...(state.externalListPlaceholders ?? []).filter(
        (p) => p.fieldId !== fieldId,
      ),
      { fieldId, placeholder },
    ],
    sections: updatedSections,
    application: { ...state.application, sections: updatedSections },
    currentScreen: {
      ...currentScreen,
      data:
        updatedSections[state.currentSection.index]?.screens?.[
          currentScreen.index
        ] ?? undefined,
    },
  }
}
