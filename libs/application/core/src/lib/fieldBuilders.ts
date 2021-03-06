import { FormatInputValueFunction } from 'react-number-format'
import { Colors } from '@island.is/island-ui/theme'
import type {
  DatePickerBackgroundColor,
  InputBackgroundColor,
} from '@island.is/island-ui/core'

import { Application } from '../types/Application'
import { Condition } from '../types/Condition'
import {
  CheckboxField,
  CustomField,
  DateField,
  DividerField,
  KeyValueField,
  FieldComponents,
  FieldTypes,
  FieldWidth,
  FileUploadField,
  DescriptionField,
  Option,
  RadioField,
  SubmitField,
  SelectField,
  TextField,
  TextFieldVariant,
  MaybeWithApplication,
  AsyncSelectField,
  Context,
  RecordObject,
} from '../types/Fields'
import { CallToAction } from '../types/StateMachine'
import { FormText, FormTextArray } from '../types/Form'

interface SelectOption {
  label: string
  value: string | number
}

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  title: FormText
  description?: FormText
  options: MaybeWithApplication<Option[]>
  disabled?: boolean
  width?: FieldWidth
  large?: boolean
  defaultValue?: MaybeWithApplication<unknown>
}): CheckboxField {
  const {
    condition,
    id,
    title,
    description,
    options,
    disabled = false,
    width = 'full',
    large,
    defaultValue,
  } = data
  return {
    children: undefined,
    defaultValue,
    disabled,
    width,
    large,
    condition,
    id,
    title,
    description,
    options,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  title: FormText
  placeholder?: FormText
  description?: FormText
  maxDate?: Date
  minDate?: Date
  disabled?: boolean
  width?: FieldWidth
  backgroundColor?: DatePickerBackgroundColor
  defaultValue?: MaybeWithApplication<unknown>
}): DateField {
  const {
    condition,
    id,
    title,
    description,
    defaultValue,
    maxDate,
    minDate,
    disabled = false,
    width = 'full',
    placeholder,
    backgroundColor,
  } = data
  return {
    children: undefined,
    condition,
    defaultValue,
    id,
    placeholder,
    disabled,
    width,
    title,
    description,
    maxDate,
    minDate,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
    backgroundColor,
  }
}

export function buildDescriptionField(data: {
  condition?: Condition
  id: string
  title: FormText
  description: FormText
  tooltip?: FormText
}): DescriptionField {
  const { condition, id, title, description, tooltip } = data
  return {
    children: undefined,
    condition,
    description,
    tooltip,
    id,
    title,
    type: FieldTypes.DESCRIPTION,
    component: FieldComponents.DESCRIPTION,
  }
}

export function buildRadioField(data: {
  condition?: Condition
  id: string
  title: FormText
  description?: FormText
  options: MaybeWithApplication<Option[]>
  emphasize?: boolean
  largeButtons?: boolean
  disabled?: boolean
  width?: FieldWidth
  defaultValue?: MaybeWithApplication<unknown>
}): RadioField {
  const {
    condition,
    id,
    title,
    description,
    defaultValue,
    options,
    emphasize = false,
    largeButtons = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    defaultValue,
    emphasize,
    largeButtons,
    disabled,
    width,
    condition,
    id,
    title,
    description,
    options,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(data: {
  condition?: Condition
  id: string
  title: FormText
  description?: FormText
  placeholder?: FormText
  options: MaybeWithApplication<Option[]>
  disabled?: boolean
  width?: FieldWidth
  onSelect?: (s: SelectOption, cb: (t: unknown) => void) => void
  defaultValue?: MaybeWithApplication<unknown>
  backgroundColor?: InputBackgroundColor
}): SelectField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    options,
    placeholder,
    disabled = false,
    width = 'full',
    onSelect,
    backgroundColor,
  } = data
  return {
    children: undefined,
    defaultValue,
    placeholder,
    disabled,
    width,
    condition,
    id,
    title,
    description,
    options,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
    onSelect,
    backgroundColor,
  }
}

export function buildAsyncSelectField(data: {
  condition?: Condition
  id: string
  title: FormText
  description?: FormText
  placeholder?: FormText
  loadOptions: (c: Context) => Promise<Option[]>
  loadingError?: FormText
  disabled?: boolean
  width?: FieldWidth
  onSelect?: (s: SelectOption, cb: (t: unknown) => void) => void
  defaultValue?: MaybeWithApplication<unknown>
  backgroundColor?: InputBackgroundColor
}): AsyncSelectField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    loadOptions,
    loadingError,
    placeholder,
    disabled = false,
    width = 'full',
    onSelect,
    backgroundColor,
  } = data
  return {
    children: undefined,
    defaultValue,
    placeholder,
    disabled,
    width,
    condition,
    id,
    title,
    description,
    loadOptions,
    loadingError,
    type: FieldTypes.ASYNC_SELECT,
    component: FieldComponents.ASYNC_SELECT,
    onSelect,
    backgroundColor,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  title: FormText
  description?: FormText
  disabled?: boolean
  width?: FieldWidth
  variant?: TextFieldVariant
  placeholder?: FormText
  format?: string | FormatInputValueFunction
  backgroundColor?: InputBackgroundColor
  suffix?: string
  defaultValue?: MaybeWithApplication<unknown>
  rows?: number
}): TextField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    backgroundColor,
    placeholder,
    disabled = false,
    width = 'full',
    variant = 'text',
    format,
    suffix,
    rows,
  } = data
  return {
    children: undefined,
    defaultValue,
    placeholder,
    disabled,
    width,
    condition,
    backgroundColor,
    id,
    title,
    description,
    variant,
    format,
    suffix,
    rows,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    childInputIds?: string[]
    title: FormText
    description?: FormText
    component: string
    defaultValue?: MaybeWithApplication<unknown>
  },
  props?: RecordObject,
): CustomField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    component,
    childInputIds,
  } = data
  return {
    children: undefined,
    defaultValue,
    condition,
    id,
    childInputIds,
    title,
    description,
    type: FieldTypes.CUSTOM,
    component,
    props: props ?? {},
  }
}

export function buildFileUploadField(data: {
  condition?: Condition
  id: string
  title: FormText
  introduction: FormText
  uploadHeader?: FormText
  uploadDescription?: FormText
  uploadButtonLabel?: FormText
  uploadMultiple?: boolean
  uploadAccept?: string
  maxSize?: number
}): FileUploadField {
  const {
    condition,
    id,
    title,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
  } = data
  return {
    children: undefined,
    condition,
    id,
    title,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: {
  condition?: Condition
  title?: FormText
  color?: Colors
}): DividerField {
  const { title, color, condition } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    title: title ?? '',
    color,
    condition,
  }
}

export function buildKeyValueField(data: {
  label: FormText
  value: FormText | FormTextArray
  width?: FieldWidth
}): KeyValueField {
  const { label, value, width = 'full' } = data

  return {
    id: '',
    title: '',
    children: undefined,
    width,
    label,
    value,
    type: FieldTypes.KEY_VALUE,
    component: FieldComponents.KEY_VALUE,
  }
}

export function buildSubmitField(data: {
  id: string
  title: FormText
  placement?: 'footer' | 'screen'
  actions: CallToAction[]
}): SubmitField {
  const { id, placement = 'footer', title, actions } = data
  return {
    children: undefined,
    id,
    title,
    actions,
    placement,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}

export function buildFieldOptions(
  maybeOptions: MaybeWithApplication<Option[]>,
  application: Application,
): Option[] {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application)
  }
  return maybeOptions
}
