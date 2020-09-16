import { CreateDetentionReqStepOneCase } from '../types'
import * as api from '../api'
import { parseString } from './formatters'

export const updateState = (
  state: CreateDetentionReqStepOneCase,
  fieldToUpdate: string,
  fieldValue: string | string[] | Date,
  stateSetter: (state: any) => void,
) => {
  // Create a copy of the state
  const copyOfState = Object.assign({}, state)

  // Update the copy of the state
  if (fieldToUpdate === 'id') {
    copyOfState.id = fieldValue.toString()
  } else {
    copyOfState.case[fieldToUpdate] = fieldValue
  }

  // Set the copy of the state as the state
  stateSetter(copyOfState)

  window.localStorage.setItem('workingCase', JSON.stringify(copyOfState))
}

export const autoSave = async (
  state: CreateDetentionReqStepOneCase,
  caseField: string,
  caseFieldValue: string | Date,
  stateSetter: (state: any) => void,
) => {
  // Only save if the field has changes and the case exists
  if (state[caseField] !== caseFieldValue && state.id !== '') {
    // Parse the property change
    const propertyChange = parseString(caseField, caseFieldValue)

    // Save the case
    const response = await api.saveCase(state.id, propertyChange)

    if (response === 200) {
      // Update the working case
      updateState(state, caseField, caseFieldValue, stateSetter)
    } else {
      // TODO: Do something when autosave fails
    }
  }
}
