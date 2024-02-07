import {
  Pass,
  PassDataInput,
  PassInputFieldValueDataInput,
} from '../../gen/schema'
import { ServiceErrorCode } from './smartSolutions.types'

export function mapErrorToActionStatusCode(
  exception?: string,
): ServiceErrorCode {
  switch (exception) {
    case 'NotFoundException':
      return 3
    case 'IllegalArgumentException':
      return 4
    case 'InvalidDataException':
      return 4
    case 'ForbiddenException':
      return 7
    case 'UnauthorizedException':
      return 6
    case 'PersistenceException':
      return 13
    default:
      return 99
  }
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
