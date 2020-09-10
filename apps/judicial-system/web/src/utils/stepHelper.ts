import {
  CreateDetentionReqStepOneCase,
  CreateDetentionReqStepTwoCase,
} from '../types'
import * as api from '../api'

export const updateState = (
  state: CreateDetentionReqStepOneCase | CreateDetentionReqStepTwoCase,
  fieldToUpdate: string,
  fieldValue: string | Date,
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
}

export const autoSave = async (
  state: CreateDetentionReqStepOneCase | CreateDetentionReqStepTwoCase,
  caseField: string,
  caseFieldValue: string | Date,
  stateSetter: (state: any) => void,
) => {
  // Only save if the field has changes and the case exists
  if (state[caseField] !== caseFieldValue && state.id !== '') {
    // Save the case
    const response = await api.saveCase(state.id, caseField, caseFieldValue)

    if (response === 200) {
      // Update the working case
      updateState(state, caseField, caseFieldValue, stateSetter)
    } else {
      // TODO: Do something when autosave fails
    }
  }
}
