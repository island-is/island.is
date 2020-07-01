import {
  CheckboxField,
  Condition,
  DateField,
  FieldTypes,
  IntroductionField,
  Option,
  RadioField,
  TextField,
  ValidationError,
} from '@island.is/application/schema'

import { isAfter, isBefore } from 'date-fns'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: string
  options: Option[]
  isRequired: boolean
}): CheckboxField {
  const { condition, id, name, options, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    name,
    options,
    type: FieldTypes.CHECKBOX,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(answer: any): ValidationError {
      if (isRequired && !answer) {
        return { error: 'this is required' }
      }
      return {}
    },
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: string
  maxDate?: Date
  minDate?: Date
  isRequired: boolean
}): DateField {
  const { condition, id, name, maxDate, minDate, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    name,
    maxDate,
    minDate,
    type: FieldTypes.DATE,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(answer: any): ValidationError {
      if (isRequired && !answer) {
        return { error: 'this is required' }
      }
      if (maxDate && isAfter(answer, maxDate)) {
        return { error: 'your answer is too far in the future' }
      }
      if (minDate && isBefore(answer, minDate)) {
        return { error: 'your answer is too far in the past' }
      }
      return {}
    },
  }
}

export function buildIntroductionField(data: {
  condition?: Condition
  id: string
  name: string
  introduction: string
}): IntroductionField {
  const { condition, id, name, introduction } = data
  return {
    children: undefined,
    condition,
    introduction,
    id,
    name,
    type: FieldTypes.INTRO,
  }
}

export function buildRadioField(data: {
  condition?: Condition
  id: string
  name: string
  options: Option[]
  isRequired: boolean
}): RadioField {
  const { condition, id, name, options, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    name,
    options,
    type: FieldTypes.RADIO,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(answer: any): ValidationError {
      if (isRequired && !answer) {
        return { error: 'this is required' }
      }
      return {}
    },
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: string
  isRequired: boolean
}): TextField {
  const { condition, id, name, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    name,
    type: FieldTypes.TEXT,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(answer: any): ValidationError {
      if (isRequired && !answer) {
        return { error: 'this is required' }
      }
      return {}
    },
  }
}
