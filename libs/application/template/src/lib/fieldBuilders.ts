import { Condition } from '../types/Condition'
import {
  CheckboxField,
  CustomField,
  CustomFieldComponents,
  DateField,
  FieldComponents,
  FieldTypes,
  IntroductionField,
  Option,
  RadioField,
  SelectField,
  TextField,
  FileUploadField,
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
    component: FieldComponents.CHECKBOX,
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
    component: FieldComponents.TEXT,
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
    component: FieldComponents.INTRO,
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
    component: FieldComponents.RADIO,
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
    component: FieldComponents.SELECT,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: string
  disabled?: boolean
  required?: boolean
}): TextField {
  const { condition, id, name, required = false, disabled = false } = data
  return {
    children: undefined,
    disabled,
    required,
    isQuestion: true,
    condition,
    id,
    name,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    name: string
    required?: boolean
    component: CustomFieldComponents
  },
  props: object,
): CustomField {
  const { condition, id, name, required = false, component } = data
  return {
    children: undefined,
    required,
    isQuestion: true,
    condition,
    id,
    name,
    type: FieldTypes.CUSTOM,
    component,
    props,
  }
}

export function buildFileUploadField(data: {
  condition?: Condition
  id: string
  name: string
  introduction: string
  uploadHeader?: string
  uploadDescription?: string
  upploadButtonLabel?: string
  uploadMultiple?: boolean
  uploadAccept?: string
  required?: boolean
}): FileUploadField {
  const {
    condition,
    id,
    name,
    introduction,
    uploadHeader,
    uploadDescription,
    upploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    required = false,
  } = data
  return {
    children: undefined,
    required,
    isQuestion: true,
    condition,
    id,
    name,
    introduction,
    uploadHeader,
    uploadDescription,
    upploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}
