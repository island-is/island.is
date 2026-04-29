import {
  AllOrAny,
  Application,
  Comparators,
  Condition,
  DynamicCheck,
  Field,
  FieldTypes,
  FormItemTypes,
  MultiField,
  StaticCheck,
  FormText,
  StaticText,
  DataTableRow,
} from '@island.is/application/types'
import { BoxProps } from '@island.is/island-ui/core/types'

/** Builder-time field: satisfies `Field` while allowing extra props not on every union member. */
type MutableField = Field & Record<string, unknown>

type SimpleCondition = {
  field: string
  equals?: string | number
  notEquals?: string | number
  contains?: string | number
  gt?: number
  gte?: number
  lt?: number
  lte?: number
}

type ShowWhen =
  | SimpleCondition
  | { all: SimpleCondition[] }
  | { any: SimpleCondition[] }
  | DynamicCheck

interface FieldOptions {
  showWhen?: ShowWhen
  disabled?: boolean
  width?: 'full' | 'half'
  defaultValue?: unknown
  doesNotRequireAnswer?: boolean
  description?: FormText
  placeholder?: FormText
  required?: boolean
  variant?: 'text' | 'email' | 'number' | 'currency' | 'tel' | 'textarea'
  /** Mirrors `buildTextField` / `TextField` for SDF screen mapping. */
  backgroundColor?: 'blue' | 'white'
  readOnly?: boolean
  rightAlign?: boolean
  format?: string
  suffix?: FormText
  showMaxLength?: boolean
  thousandSeparator?: boolean
  allowNegative?: boolean
  maxLength?: number
  rows?: number
  min?: number
  max?: number
  step?: string
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  space?: BoxProps['paddingTop']
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  titleTooltip?: FormText
  uploadAccept?: string
  uploadMultiple?: boolean
  uploadHeader?: FormText
  uploadDescription?: FormText
  maxSize?: number
}

type OptionList = Array<string | { label: string; value: string }>
type DynamicOptions = (application: any) => OptionList

interface RadioSelectOptions extends FieldOptions {
  options: OptionList | DynamicOptions
}

/** Select-only: template API `action` names to run on SDF REFETCH when the value changes. */
interface SelectFieldOptions extends RadioSelectOptions {
  onSelectRefetch?: string[]
  refetchTargets?: string[]
}

interface SearchFieldOptions extends FieldOptions {
  searchAction: string
  options: OptionList | DynamicOptions
  onSelectRefetch?: string[]
  refetchTargets?: string[]
  minQueryLength?: number
}

interface DataTableFieldOptions extends Omit<FieldOptions, 'rows'> {
  header: StaticText[] | ((application: Application) => StaticText[])
  rows: DataTableRow[] | ((application: Application) => DataTableRow[])
}

interface AlertMessageFieldOptions extends FieldOptions {
  alertType?: 'default' | 'warning' | 'error' | 'info' | 'success'
  message: FormText | ((application: Application) => FormText)
  title?: FormText
}

interface StaticTableFieldOptions extends Omit<FieldOptions, 'rows'> {
  header: StaticText[] | ((application: Application) => StaticText[])
  rows: StaticText[][] | ((application: Application) => StaticText[][])
}

interface HiddenInputWithWatchedValueFieldOptions extends FieldOptions {
  watchValue: string
}

const toStaticCheck = (c: SimpleCondition): StaticCheck => {
  const comparator =
    c.equals !== undefined
      ? Comparators.EQUALS
      : c.notEquals !== undefined
      ? Comparators.NOT_EQUAL
      : c.contains !== undefined
      ? Comparators.CONTAINS
      : c.gt !== undefined
      ? Comparators.GT
      : c.gte !== undefined
      ? Comparators.GTE
      : c.lt !== undefined
      ? Comparators.LT
      : c.lte !== undefined
      ? Comparators.LTE
      : Comparators.EQUALS

  const value =
    c.equals ??
    c.notEquals ??
    c.contains ??
    c.gt ??
    c.gte ??
    c.lt ??
    c.lte ??
    ''

  return { questionId: c.field, comparator, value }
}

const resolveShowWhen = (showWhen: ShowWhen): Condition => {
  if (typeof showWhen === 'function') {
    return showWhen
  }

  if ('all' in showWhen || 'any' in showWhen) {
    const checks =
      'all' in showWhen
        ? showWhen.all
        : (showWhen as { any: SimpleCondition[] }).any
    return {
      isMultiCheck: true,
      show: true,
      on: 'all' in showWhen ? AllOrAny.ALL : AllOrAny.ANY,
      check: checks.map(toStaticCheck),
    }
  }

  return toStaticCheck(showWhen as SimpleCondition)
}

const normalizeOptions = (
  options: OptionList | DynamicOptions,
): OptionList | DynamicOptions => {
  if (typeof options === 'function') {
    return (app: Application) => {
      const resolved = options(app)
      return resolved.map((o: string | { label: string; value: string }) =>
        typeof o === 'string' ? { label: o, value: o } : o,
      )
    }
  }
  return options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o,
  )
}

const resolveWidth = (width?: 'full' | 'half'): 'full' | 'half' | undefined => {
  return width
}

const makeBaseField = (
  id: string,
  title: FormText,
  type: FieldTypes,
  component: string,
  opts?: FieldOptions,
): MutableField => {
  const field = {
    id,
    title: title ?? '',
    type,
    component,
    children: undefined,
    ...(opts?.description !== undefined && { description: opts.description }),
  } as unknown as MutableField

  if (opts?.showWhen) {
    field.condition = resolveShowWhen(opts.showWhen)
  }

  if (opts?.disabled !== undefined) {
    field.disabled = opts.disabled
  }

  if (opts?.width) {
    field.width = resolveWidth(opts.width)
  }

  if (opts?.defaultValue !== undefined) {
    field.defaultValue = opts.defaultValue as any
  }

  if (opts?.doesNotRequireAnswer !== undefined) {
    field.doesNotRequireAnswer = opts.doesNotRequireAnswer
  }

  if (opts?.placeholder !== undefined) {
    field.placeholder = opts.placeholder
  }

  if (opts?.required !== undefined) {
    field.required = opts.required
  }

  if (opts?.variant !== undefined) {
    field.variant = opts.variant
  }

  const m = field as Record<string, unknown>
  if (opts?.backgroundColor !== undefined) {
    m.backgroundColor = opts.backgroundColor
  }
  if (opts?.readOnly !== undefined) {
    m.readOnly = opts.readOnly
  }
  if (opts?.rightAlign !== undefined) {
    m.rightAlign = opts.rightAlign
  }
  if (opts?.format !== undefined) {
    m.format = opts.format
  }
  if (opts?.suffix !== undefined) {
    m.suffix = opts.suffix
  }
  if (opts?.showMaxLength !== undefined) {
    m.showMaxLength = opts.showMaxLength
  }
  if (opts?.thousandSeparator !== undefined) {
    m.thousandSeparator = opts.thousandSeparator
  }
  if (opts?.allowNegative !== undefined) {
    m.allowNegative = opts.allowNegative
  }
  if (opts?.maxLength !== undefined) {
    m.maxLength = opts.maxLength
  }
  if (opts?.rows !== undefined) {
    m.rows = opts.rows
  }
  if (opts?.min !== undefined) {
    m.min = opts.min
  }
  if (opts?.max !== undefined) {
    m.max = opts.max
  }
  if (opts?.step !== undefined) {
    m.step = opts.step
  }
  if (opts?.marginTop !== undefined) {
    m.marginTop = opts.marginTop
  }
  if (opts?.marginBottom !== undefined) {
    m.marginBottom = opts.marginBottom
  }
  if (opts?.space !== undefined) {
    m.space = opts.space
  }
  if (opts?.titleVariant !== undefined) {
    m.titleVariant = opts.titleVariant
  }
  if (opts?.titleTooltip !== undefined) {
    m.titleTooltip = opts.titleTooltip
  }
  if (opts?.uploadAccept !== undefined) {
    m.uploadAccept = opts.uploadAccept
  }
  if (opts?.uploadMultiple !== undefined) {
    m.uploadMultiple = opts.uploadMultiple
  }
  if (opts?.uploadHeader !== undefined) {
    m.uploadHeader = opts.uploadHeader
  }
  if (opts?.uploadDescription !== undefined) {
    m.uploadDescription = opts.uploadDescription
  }
  if (opts?.maxSize !== undefined) {
    m.maxSize = opts.maxSize
  }

  return field
}

export class PageBuilder<TSchema = unknown> {
  private fields: MutableField[] = []
  private _id: string
  private _title: FormText

  constructor(id: string, title: FormText) {
    this._id = id
    this._title = title
  }

  addTextField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(id, title, FieldTypes.TEXT, 'TextFormField', opts),
    )
    return this
  }

  /** When `opts.width` is `'half'`, SDF renders options side-by-side (e.g. Já/Nei); `'full'` stacks one per row. */
  addRadioField(id: string, title: FormText, opts?: RadioSelectOptions): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.RADIO,
      'RadioFormField',
      opts,
    )
    if (opts?.options) {
      field.options = normalizeOptions(opts.options)
    }
    this.fields.push(field)
    return this
  }

  addSelectField(id: string, title: FormText, opts?: SelectFieldOptions): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.SELECT,
      'SelectFormField',
      opts,
    )
    if (opts?.options) {
      field.options = normalizeOptions(opts.options)
    }
    if (opts?.onSelectRefetch?.length) {
      field.inlineRefetchTemplateApis = opts.onSelectRefetch
    }
    if (opts?.refetchTargets?.length) {
      field.refetchTargets = opts.refetchTargets
    }
    this.fields.push(field)
    return this
  }

  addSearchField(id: string, title: FormText, opts: SearchFieldOptions): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.SEARCH,
      'SearchFormField',
      opts,
    )
    field.searchAction = opts.searchAction
    field.options = normalizeOptions(opts.options)
    if (opts.minQueryLength !== undefined) {
      field.minQueryLength = opts.minQueryLength
    }
    if (opts.onSelectRefetch?.length) {
      field.inlineRefetchTemplateApis = opts.onSelectRefetch
    }
    if (opts.refetchTargets?.length) {
      field.refetchTargets = opts.refetchTargets
    }
    this.fields.push(field)
    return this
  }

  addDataTableField(
    id: string,
    title: FormText,
    opts: DataTableFieldOptions,
  ): this {
    const { header, rows, ...fieldOpts } = opts
    const field = makeBaseField(
      id,
      title,
      FieldTypes.DATA_TABLE,
      'DataTableFormField',
      fieldOpts,
    )
    field.header = header
    field.rows = rows
    this.fields.push(field)
    return this
  }

  addCheckboxField(
    id: string,
    title: FormText,
    opts?: RadioSelectOptions,
  ): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.CHECKBOX,
      'CheckboxFormField',
      opts,
    )
    if (opts?.options) {
      field.options = normalizeOptions(opts.options)
    }
    this.fields.push(field)
    return this
  }

  addDateField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(id, title, FieldTypes.DATE, 'DateFormField', opts),
    )
    return this
  }

  addFileUploadField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(
        id,
        title,
        FieldTypes.FILEUPLOAD,
        'FileUploadFormField',
        opts,
      ),
    )
    return this
  }

  addSubmitField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(id, title, FieldTypes.SUBMIT, 'SubmitFormField', opts),
    )
    return this
  }

  addDescriptionField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(
        id,
        title,
        FieldTypes.DESCRIPTION,
        'DescriptionFormField',
        opts,
      ),
    )
    return this
  }

  addAlertMessageField(
    id: string,
    opts: AlertMessageFieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      opts.title ?? '',
      FieldTypes.ALERT_MESSAGE,
      'AlertMessageFormField',
      {
        ...opts,
        doesNotRequireAnswer: true,
      },
    )
    field.alertType = opts.alertType ?? 'info'
    field.message = opts.message
    this.fields.push(field)
    return this
  }

  addStaticTableField(
    id: string,
    title: FormText,
    opts: StaticTableFieldOptions,
  ): this {
    const { header, rows, ...fieldOpts } = opts
    const field = makeBaseField(
      id,
      title,
      FieldTypes.STATIC_TABLE,
      'StaticTableFormField',
      {
        ...fieldOpts,
        doesNotRequireAnswer: true,
      },
    )
    field.header = header
    field.rows = rows
    this.fields.push(field)
    return this
  }

  addHiddenInputWithWatchedValue(
    id: string,
    opts: HiddenInputWithWatchedValueFieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      '',
      FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE,
      'HiddenInputWithWatchedValueFormField',
      opts,
    )
    field.watchValue = opts.watchValue
    this.fields.push(field)
    return this
  }

  addDividerField(id: string, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(id, '', FieldTypes.DIVIDER, 'DividerFormField', opts),
    )
    return this
  }

  addPhoneField(id: string, title: FormText, opts?: FieldOptions): this {
    this.fields.push(
      makeBaseField(id, title, FieldTypes.PHONE, 'PhoneFormField', opts),
    )
    return this
  }

  addKeyValueField(
    id: string,
    title: FormText,
    value: FormText | ((app: any) => string),
    opts?: FieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.KEY_VALUE,
      'KeyValueFormField',
      {
        ...opts,
        doesNotRequireAnswer: true,
      },
    )
    ;(field as any).value = value
    this.fields.push(field)
    return this
  }

  addDisplayField(
    id: string,
    title: FormText,
    value: FormText | ((app: any) => string),
    opts?: FieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.DISPLAY,
      'DisplayFormField',
      {
        ...opts,
        doesNotRequireAnswer: true,
      },
    )
    ;(field as any).value = value
    this.fields.push(field)
    return this
  }

  addCustomComponent(
    id: string,
    componentName: string,
    opts?: FieldOptions,
  ): this {
    const field = makeBaseField(id, '', FieldTypes.CUSTOM, componentName, opts)
    this.fields.push(field)
    return this
  }

  build(): MultiField {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.MULTI_FIELD,
      children: this.fields as Field[],
    }
  }
}
