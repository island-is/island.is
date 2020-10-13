import { MessageDescriptor } from 'react-intl'
import { Condition } from '../types/Condition'
import {
  CheckboxField,
  CustomField,
  DateField,
  DividerField,
  FieldComponents,
  FieldTypes,
  FieldWidth,
  FileUploadField,
  IntroductionField,
  Option,
  RadioField,
  ReviewField,
  SelectField,
  TextField,
} from '../types/Fields'
import { CallToAction } from '../types/StateMachine'
import { FormText } from '..'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  options: Option[]
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): CheckboxField {
  const {
    condition,
    id,
    name,
    description,
    options,
    required = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    required,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: FormText
  placeholder?: FormText
  description?: FormText
  maxDate?: Date
  minDate?: Date
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): DateField {
  const {
    condition,
    id,
    name,
    description,
    maxDate,
    minDate,
    required = false,
    disabled = false,
    width = 'full',
    placeholder,
  } = data
  return {
    children: undefined,
    condition,
    id,
    required,
    placeholder,
    disabled,
    width,
    name,
    description,
    maxDate,
    minDate,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
  }
}

export function buildIntroductionField(data: {
  condition?: Condition
  id: string
  name: FormText
  introduction: FormText
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
  name: FormText
  description?: FormText
  options: Option[]
  required?: boolean
  emphasize?: boolean
  largeButtons?: boolean
  disabled?: boolean
  width?: FieldWidth
}): RadioField {
  const {
    condition,
    id,
    name,
    description,
    options,
    required = false,
    emphasize = false,
    largeButtons = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    required,
    emphasize,
    largeButtons,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  placeholder?: string
  options: Option[]
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): SelectField {
  const {
    condition,
    id,
    name,
    description,
    options,
    placeholder,
    required = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    placeholder,
    required,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): TextField {
  const {
    condition,
    id,
    name,
    description,
    required = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    required,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    name: FormText
    required?: boolean
    component: string
  },
  props: object,
): CustomField {
  const { condition, id, name, required = false, component } = data
  return {
    children: undefined,
    required,
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
  name: FormText
  introduction: FormText
  uploadHeader?: string
  uploadDescription?: string
  uploadButtonLabel?: string
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
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    required = false,
  } = data
  return {
    children: undefined,
    required,
    condition,
    id,
    name,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: { name: string }): DividerField {
  const { name } = data
  return {
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    id: name,
    name,
  }
}

export function buildReviewField(data: {
  id: string
  name: string
  actions: CallToAction[]
}): ReviewField {
  const { id, name, actions } = data
  return {
    children: undefined,
    id,
    name,
    actions,
    type: FieldTypes.REVIEW,
    component: FieldComponents.REVIEW,
  }
}
