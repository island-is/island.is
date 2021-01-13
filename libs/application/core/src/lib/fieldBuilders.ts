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
} from '../types/Fields'
import { CallToAction } from '../types/StateMachine'
import { FormText } from '../types/Form'
import { Colors } from '@island.is/island-ui/theme'
import { FormatInputValueFunction } from 'react-number-format'

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
  backgroundColor?: 'white' | 'blue'
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
}): DescriptionField {
  const { condition, id, title, description } = data
  return {
    children: undefined,
    condition,
    description,
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
  suffix?: string
  defaultValue?: MaybeWithApplication<unknown>
}): TextField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    placeholder,
    disabled = false,
    width = 'full',
    variant = 'text',
    format,
    suffix,
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
    variant,
    format,
    suffix,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    title: FormText
    description?: FormText
    component: string
    defaultValue?: MaybeWithApplication<unknown>
  },
  props?: object,
): CustomField {
  const { condition, defaultValue, id, title, description, component } = data
  return {
    children: undefined,
    defaultValue,
    condition,
    id,
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
  uploadHeader?: string
  uploadDescription?: string
  uploadButtonLabel?: string
  uploadMultiple?: boolean
  uploadAccept?: string
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
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: {
  title?: FormText
  color?: Colors
}): DividerField {
  const { title, color } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    title: title ?? '',
    color,
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
