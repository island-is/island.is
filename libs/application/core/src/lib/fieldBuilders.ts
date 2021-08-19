import { FormatInputValueFunction } from 'react-number-format'
import { Colors } from '@island.is/island-ui/theme'
import type {
  DatePickerBackgroundColor,
  InputBackgroundColor,
  BoxProps,
} from '@island.is/island-ui/core/types'

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
  MaybeWithApplicationAndField,
  AsyncSelectField,
  Context,
  RecordObject,
  Field,
  TitleVariants,
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
  options: MaybeWithApplicationAndField<Option[]>
  disabled?: boolean
  width?: FieldWidth
  large?: boolean
  strong?: boolean
  backgroundColor?: InputBackgroundColor
  defaultValue?: MaybeWithApplicationAndField<unknown>
}): CheckboxField {
  const {
    condition,
    id,
    title,
    description,
    options,
    disabled = false,
    width = 'full',
    strong = false,
    large = true,
    backgroundColor = 'blue',
    defaultValue,
  } = data
  return {
    children: undefined,
    defaultValue,
    disabled,
    width,
    large,
    strong,
    backgroundColor,
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
  minDate?: MaybeWithApplicationAndField<Date>
  excludeDates?: MaybeWithApplicationAndField<Date[]>
  disabled?: boolean
  width?: FieldWidth
  backgroundColor?: DatePickerBackgroundColor
  defaultValue?: MaybeWithApplicationAndField<unknown>
}): DateField {
  const {
    condition,
    id,
    title,
    description,
    defaultValue,
    maxDate,
    minDate,
    excludeDates,
    disabled = false,
    width = 'full',
    placeholder,
    backgroundColor = 'blue',
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
    excludeDates,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
    backgroundColor,
  }
}

export function buildDescriptionField(data: {
  condition?: Condition
  id: string
  title: FormText
  titleVariant?: TitleVariants
  description: FormText
  space?: BoxProps['paddingTop']
  tooltip?: FormText
}): DescriptionField {
  const {
    condition,
    id,
    titleVariant = 'h2',
    title,
    description,
    tooltip,
    space,
  } = data
  return {
    children: undefined,
    condition,
    description,
    titleVariant,
    tooltip,
    space,
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
  options: MaybeWithApplicationAndField<Option[]>
  largeButtons?: boolean
  disabled?: boolean
  width?: FieldWidth
  defaultValue?: MaybeWithApplicationAndField<unknown>
  backgroundColor?: InputBackgroundColor
  space?: BoxProps['paddingTop']
}): RadioField {
  const {
    condition,
    id,
    title,
    description,
    defaultValue,
    options,
    largeButtons = true,
    disabled = false,
    width = 'full',
    backgroundColor,
    space,
  } = data

  return {
    children: undefined,
    defaultValue,
    largeButtons,
    disabled,
    width,
    condition,
    id,
    title,
    description,
    options,
    backgroundColor,
    space,
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
  options: MaybeWithApplicationAndField<Option[]>
  disabled?: boolean
  width?: FieldWidth
  onSelect?: (s: SelectOption, cb: (t: unknown) => void) => void
  defaultValue?: MaybeWithApplicationAndField<unknown>
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
    backgroundColor = 'blue',
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
  defaultValue?: MaybeWithApplicationAndField<unknown>
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
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
    backgroundColor = 'blue',
    isSearchable,
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
    isSearchable,
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
  defaultValue?: MaybeWithApplicationAndField<unknown>
  rows?: number
  required?: boolean
}): TextField {
  const {
    condition,
    defaultValue,
    id,
    title,
    description,
    backgroundColor = 'blue',
    placeholder,
    disabled = false,
    width = 'full',
    variant = 'text',
    format,
    suffix,
    rows,
    required,
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
    required,
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
    defaultValue?: MaybeWithApplicationAndField<unknown>
    width?: FieldWidth
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
    width = 'full',
  } = data
  return {
    children: undefined,
    defaultValue,
    condition,
    id,
    childInputIds,
    title,
    width,
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
  condition?: Condition
}): KeyValueField {
  const { label, value, condition, width = 'full' } = data

  return {
    id: '',
    title: '',
    children: undefined,
    condition,
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
  refetchApplicationAfterSubmit?: boolean
  actions: CallToAction[]
}): SubmitField {
  const {
    id,
    placement = 'footer',
    title,
    actions,
    refetchApplicationAfterSubmit,
  } = data
  return {
    children: undefined,
    id,
    title,
    actions,
    placement,
    refetchApplicationAfterSubmit:
      typeof refetchApplicationAfterSubmit !== 'undefined'
        ? refetchApplicationAfterSubmit
        : false,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}

export function buildFieldOptions(
  maybeOptions: MaybeWithApplicationAndField<Option[]>,
  application: Application,
  field: Field,
): Option[] {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application, field)
  }

  return maybeOptions
}
