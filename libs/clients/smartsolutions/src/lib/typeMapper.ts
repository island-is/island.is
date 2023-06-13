import {
  Pass,
  PassDataInput,
  PassInputFieldValueDataInput,
} from '../../gen/schema'
import { ServiceErrorCode } from './smartSolutions.types'

export const ErrorMessageToActionStatusCodeMap: Record<string, number> = {
  'Invalid barcode. Please try to refresh the pass.': 3,
  'Expired barcode. Please refresh the pass.': 3,
  'Request contains some field errors': 4,
}

export function mapErrorMessageToActionStatusCode(
  message?: string,
): ServiceErrorCode {
  if (!message) {
    return 99
  }
  //Check for mandatory input fields
  if (message.startsWith('Missing following mandatory inputfields')) {
    return 4
  }

  return message in ErrorMessageToActionStatusCodeMap
    ? (ErrorMessageToActionStatusCodeMap[message] as ServiceErrorCode)
    : 99
}

export function mapPassToPassDataInput(pass: Pass): PassDataInput {
  if (!pass.inputFieldValues) {
    return pass as PassDataInput
  }

  const mappedValues = pass.inputFieldValues.map((i) => {
    const inputField: PassInputFieldValueDataInput = {
      identifier: i.passInputField.identifier,
      value: i.value,
    }
    return inputField
  })

  const updatedPass: PassDataInput = { ...pass }
  updatedPass.inputFieldValues = mappedValues

  return updatedPass
}

export function mergeInputFields(
  original?: Array<PassInputFieldValueDataInput>,
  toUpdate?: Array<PassInputFieldValueDataInput>,
) {
  if (!original || !toUpdate) {
    return original ?? toUpdate ?? null
  }

  const updatedInputFields = original

  for (const field of toUpdate) {
    const fieldToUpdate = original.find(
      (v) => v.identifier === field.identifier,
    )

    if (!fieldToUpdate) {
      updatedInputFields.push(field)
      continue
    }

    const index = updatedInputFields.indexOf(fieldToUpdate)
    //update!
    updatedInputFields[index].value = field.value
  }

  return updatedInputFields
}
