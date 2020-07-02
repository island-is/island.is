import { Condition } from '../types/condition'
import { FieldTypes, Option } from '../types/fields/base'
import { CheckboxField } from '../types/fields/checkbox-field'
import { DateField } from '../types/fields/date-field'
import { RadioField } from '../types/fields/radio-field'
import { TextField } from '../types/fields/text-field'
import { IntroductionField } from '../types/fields/introduction-field'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: string
  options: Option[]
  isRequired: boolean
}): CheckboxField {
  return new CheckboxField(data)
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: string
  maxDate?: Date
  minDate?: Date
  isRequired: boolean
}): DateField {
  return new DateField(data)
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
  return new RadioField(data)
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: string
  isRequired: boolean
}): TextField {
  return new TextField(data)
}
