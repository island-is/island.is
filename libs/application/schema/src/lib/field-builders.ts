import {
  CheckboxField,
  Condition,
  DateField,
  FieldTypes,
  IntroductionField,
  Option,
  RadioField,
  TextField,
} from '@island.is/application/schema'

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
    isRequired,
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
  isRequired: boolean
}): DateField {
  const { condition, id, name, maxDate, minDate, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    condition,
    id,
    isRequired,
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
  isRequired: boolean
}): RadioField {
  const { condition, id, name, options, isRequired } = data
  return {
    children: undefined,
    isQuestion: true,
    isRequired,
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
  isRequired: boolean
}): TextField {
  const { condition, id, name, isRequired } = data
  return {
    children: undefined,
    isRequired,
    isQuestion: true,
    condition,
    id,
    name,
    type: FieldTypes.TEXT,
  }
}
