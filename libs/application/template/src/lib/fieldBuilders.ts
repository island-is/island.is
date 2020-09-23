import { MessageDescriptor } from 'react-intl'
import { Condition } from '../types/Condition'
import {
  CheckboxField,
  CustomField,
  CustomFieldComponents,
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

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: MessageDescriptor | string
  options: Option[]
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): CheckboxField {
  const {
    condition,
    id,
    name,
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
    options,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: MessageDescriptor | string
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
    maxDate,
    minDate,
    required = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    condition,
    id,
    required,
    disabled,
    width,
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
  name: MessageDescriptor | string
  introduction: MessageDescriptor | string
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
  name: MessageDescriptor | string
  options: Option[]
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): RadioField {
  const {
    condition,
    id,
    name,
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
    options,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(data: {
  condition?: Condition
  id: string
  name: MessageDescriptor | string
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
    options,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: MessageDescriptor | string
  required?: boolean
  disabled?: boolean
  width?: FieldWidth
}): TextField {
  const {
    condition,
    id,
    name,
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
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    name: MessageDescriptor | string
    required?: boolean
    component: CustomFieldComponents
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
  name: MessageDescriptor | string
  introduction: MessageDescriptor | string
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
