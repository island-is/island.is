import { Condition } from '../types/Condition'
import {
  CheckboxField,
  DateField,
  FieldTypes,
  IntroductionField,
  Option,
  RadioField,
  SelectField,
  TextField,
} from '../types/Fields'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: string
  options: Option[]
  required?: boolean
}): CheckboxField {
  const { condition, id, name, options, required = false } = data
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
  required?: boolean
}): DateField {
  const { condition, id, name, maxDate, minDate, required = false } = data
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
  required?: boolean
}): RadioField {
  const { condition, id, name, options, required = false } = data
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

export function buildSelectField(data: {
  condition?: Condition
  id: string
  name: string
  placeholder?: string
  options: Option[]
  required?: boolean
}): SelectField {
  const { condition, id, name, options, placeholder, required = false } = data
  return {
    children: undefined,
    isQuestion: true,
    placeholder,
    required,
    condition,
    id,
    name,
    options,
    type: FieldTypes.SELECT,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: string
  required?: boolean
}): TextField {
  const { condition, id, name, required = false } = data
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
