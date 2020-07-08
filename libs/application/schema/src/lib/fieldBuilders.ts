import { Condition } from '../types/Condition'
import {
  CheckboxField,
  DateField,
  FieldTypes,
  IntroductionField,
  Option,
  RadioField,
  TextField,
} from '../types/Fields'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: string
  options: Option[]
  required: boolean
}): CheckboxField {
  const { condition, id, name, options, required } = data
  return {
    children: undefined,
    isQuestion: true,
    required: required,
    condition,
    id,
    name,
    options,
    type: FieldTypes.CHECKBOX,
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: string
  maxDate?: Date
  minDate?: Date
  required: boolean
}): DateField {
  const { condition, id, name, maxDate, minDate, required } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    required: required,
    name,
    maxDate,
    minDate,
    type: FieldTypes.DATE,
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
  required: boolean
}): RadioField {
  const { condition, id, name, options, required } = data
  return {
    children: undefined,
    isQuestion: true,
    required,
    condition,
    id,
    name,
    options,
    type: FieldTypes.RADIO,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: string
  required: boolean
}): TextField {
  const { condition, id, name, required } = data
  return {
    children: undefined,
    required,
    isQuestion: true,
    condition,
    id,
    name,
    type: FieldTypes.TEXT,
  }
}
