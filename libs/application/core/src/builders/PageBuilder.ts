import {
  AllOrAny,
  Application,
  AsyncSelectField,
  BankAccountField,
  CheckboxField,
  AccordionField,
  CompanySearchField,
  Comparators,
  Condition,
  CustomField,
  DateField,
  DynamicCheck,
  DescriptionField,
  DisplayField,
  DividerField,
  Field,
  FieldTypes,
  FileUploadField,
  FormItemTypes,
  MultiField,
  NationalIdWithNameField,
  PhoneField,
  RadioField,
  RecordObject,
  SelectField,
  SliderField,
  StaticCheck,
  FormText,
  StaticText,
  DataTableRow,
  OverviewField,
  SubmitField,
  TextField,
  TitleField,
  FieldsRepeaterField,
  PaginatedSearchableTableField,
  StaticTableField,
  TableRepeaterField,
  VehiclePermnoWithInfoField,
  FormTextArray,
  FormTextWithLocale,
  FormValue,
} from '@island.is/application/types'
import { BoxProps } from '@island.is/island-ui/core/types'
import type { z } from 'zod'
import {
  buildAccordionField,
  buildAsyncSelectField,
  buildBankAccountField,
  buildCheckboxField,
  buildCompanySearchField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildDisplayField,
  buildDividerField,
  buildFileUploadField,
  buildFieldsRepeaterField,
  buildNationalIdWithNameField,
  buildOverviewField,
  buildPaginatedSearchableTableField,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildSliderField,
  buildSubmitField,
  buildStaticTableField,
  buildTableRepeaterField,
  buildTextField,
  buildTitleField,
  buildVehiclePermnoWithInfoField,
} from '../lib/fieldBuilders'
import { Locale } from '@island.is/shared/types'

/** Builder-time field: satisfies `Field` while allowing extra props not on every union member. */
type MutableField = Field & Record<string, unknown>
type ApplicationForSchema<TSchema> = TSchema extends z.ZodTypeAny
  ? z.infer<TSchema> extends FormValue
    ? Application<z.infer<TSchema>>
    : Application<FormValue>
  : Application<FormValue>
type TypedFormText<TSchema> =
  | StaticText
  | ((
      application: ApplicationForSchema<TSchema>,
    ) => StaticText | null | undefined)
type TypedFormTextArray<TSchema> =
  | StaticText[]
  | ((
      application: ApplicationForSchema<TSchema>,
    ) => (StaticText | null | undefined)[])

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

type FieldBuilderOptions<TField extends Field> = Omit<
  TField,
  'children' | 'component' | 'id' | 'title' | 'type'
>
type FieldBuilderOptionsWithTitle<TField extends Field> = Omit<
  TField,
  'children' | 'component' | 'id' | 'type'
>
type OptionList = Array<string | { label: FormText; value: string }>
type DynamicOptions<TSchema = unknown> = (
  application: ApplicationForSchema<TSchema>,
) => OptionList
type AccordionFieldOptions = FieldBuilderOptions<AccordionField>
type AsyncSelectFieldOptions = FieldBuilderOptions<AsyncSelectField>
type BankAccountFieldOptions = FieldBuilderOptions<BankAccountField>
type WithShowWhen = {
  showWhen?: ShowWhen
}
type CheckboxFieldOptions<TSchema = unknown> = Omit<
  FieldBuilderOptions<CheckboxField>,
  'options'
> &
  WithShowWhen & {
    options: OptionList | DynamicOptions<TSchema> | CheckboxField['options']
  }
type CompanySearchFieldOptions = FieldBuilderOptions<CompanySearchField>
type DateFieldOptions = FieldBuilderOptions<DateField>
type DescriptionFieldOptions = FieldBuilderOptions<DescriptionField> &
  WithShowWhen
type DisplayFieldOptions = Omit<
  DisplayField,
  'children' | 'component' | 'id' | 'title' | 'type' | 'value'
>
type DividerFieldOptions = Omit<
  DividerField,
  'children' | 'component' | 'id' | 'title' | 'type'
>
type FileUploadFieldOptions = FieldBuilderOptions<FileUploadField>
type FieldsRepeaterFieldOptions = FieldBuilderOptions<FieldsRepeaterField>
type NationalIdWithNameFieldOptions =
  FieldBuilderOptions<NationalIdWithNameField>
type OverviewFieldOptions = FieldBuilderOptions<OverviewField>
type PaginatedSearchableTableFieldOptions =
  FieldBuilderOptionsWithTitle<PaginatedSearchableTableField>
type PhoneFieldOptions = FieldBuilderOptions<PhoneField>
type RadioFieldOptions<TSchema = unknown> = Omit<
  FieldBuilderOptions<RadioField>,
  'options'
> &
  WithShowWhen & {
    options: OptionList | DynamicOptions<TSchema> | RadioField['options']
  }
type SelectFieldOptions<TSchema = unknown> = Omit<
  FieldBuilderOptions<SelectField>,
  'options'
> &
  WithShowWhen & {
    onSelectRefetch?: string[]
    options: OptionList | DynamicOptions<TSchema> | SelectField['options']
    refetchTargets?: string[]
  }
type SliderFieldOptions = FieldBuilderOptions<SliderField>
type SubmitFieldOptions = Omit<
  SubmitField,
  | 'children'
  | 'component'
  | 'doesNotRequireAnswer'
  | 'id'
  | 'placement'
  | 'renderLongErrors'
  | 'title'
  | 'type'
> & {
  placement?: SubmitField['placement']
  renderLongErrors?: SubmitField['renderLongErrors']
}
type TableRepeaterFieldOptions = FieldBuilderOptions<TableRepeaterField>
type TextFieldOptions = FieldBuilderOptions<TextField> & WithShowWhen
type TitleFieldOptions = Omit<
  TitleField,
  'children' | 'component' | 'id' | 'title' | 'type'
>
type VehiclePermnoWithInfoFieldOptions = Omit<
  VehiclePermnoWithInfoField,
  'children' | 'component' | 'id' | 'type'
>
type CustomFieldOptions = Omit<
  CustomField,
  'children' | 'component' | 'id' | 'props' | 'title' | 'type'
>
type PageBuilderOptions = {
  description?: MultiField['description']
  space?: MultiField['space']
}

interface SearchFieldOptions<TSchema = unknown> extends FieldOptions {
  searchAction: string
  options: OptionList | DynamicOptions<TSchema>
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
  summary?: StaticTableField['summary']
}

interface HiddenInputWithWatchedValueFieldOptions extends FieldOptions {
  watchValue: string
}

interface LinkFieldOptions extends Omit<FieldOptions, 'variant'> {
  condition?: Condition
  iconProps?: unknown
  justifyContent?: 'flexStart' | 'center' | 'flexEnd'
  link?: string
  s3key?: FormText
  variant?: 'text' | 'ghost' | 'utility'
}

interface ExpandableDescriptionFieldOptions extends FieldOptions {
  description: FormText
  introText?: FormText
  startExpanded?: boolean
}

interface MessageWithLinkButtonFieldOptions extends FieldOptions {
  buttonTitle: FormText
  message: FormText
  messageColor?: string
  url: string
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

const normalizeOptionList = (options: OptionList) =>
  options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))

const normalizeOptions = <TSchema,>(
  options: OptionList | DynamicOptions<TSchema> | RadioField['options'],
): RadioField['options'] => {
  if (typeof options === 'function') {
    const resolveOptions = options as (
      application: ApplicationForSchema<TSchema>,
      field: Field,
      locale: Locale,
    ) => OptionList

    return (application, field, locale) =>
      normalizeOptionList(
        resolveOptions(application as ApplicationForSchema<TSchema>, field, locale),
      )
  }

  return normalizeOptionList(options as OptionList) as RadioField['options']
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
    field.defaultValue = opts.defaultValue
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
  private fields: Field[] = []
  private _id: string
  private _title: FormTextWithLocale
  private opts: PageBuilderOptions
  private readonly _schema?: TSchema

  constructor(id: string, title: FormTextWithLocale, opts?: PageBuilderOptions) {
    this._id = id
    this._title = title
    this.opts = opts ?? {}
  }

  setDescription(description: MultiField['description']): this {
    this.opts.description = description
    return this
  }

  setSpace(space: MultiField['space']): this {
    this.opts.space = space
    return this
  }

  addFields(fields: Field[]): this {
    fields.forEach((field) => this.fields.push(field))
    return this
  }

  addTextField(id: string, title: FormText, opts?: TextFieldOptions): this {
    const { showWhen, ...fieldOpts } = opts ?? {}
    this.fields.push(
      buildTextField({
        id,
        title,
        ...fieldOpts,
        ...(showWhen ? { condition: resolveShowWhen(showWhen) } : {}),
      }),
    )
    return this
  }

  /** When `opts.width` is `'half'`, SDF renders options side-by-side (e.g. Já/Nei); `'full'` stacks one per row. */
  addRadioField(
    id: string,
    title: FormText,
    opts: RadioFieldOptions<TSchema>,
  ): this {
    this.fields.push(
      buildRadioField({
        id,
        title,
        ...opts,
        options: normalizeOptions(opts.options),
      }),
    )
    return this
  }

  addSelectField(
    id: string,
    title: FormText,
    opts: SelectFieldOptions<TSchema>,
  ): this {
    const { onSelectRefetch, refetchTargets, showWhen, ...fieldOpts } = opts
    const field = buildSelectField({
      id,
      title,
      ...fieldOpts,
      options: normalizeOptions(fieldOpts.options),
      ...(showWhen ? { condition: resolveShowWhen(showWhen) } : {}),
    }) as MutableField

    if (onSelectRefetch?.length) {
      field.inlineRefetchTemplateApis = onSelectRefetch
    }
    if (refetchTargets?.length) {
      field.refetchTargets = refetchTargets
    }

    this.fields.push(field)
    return this
  }

  addSearchField(
    id: string,
    title: FormText,
    opts: SearchFieldOptions<TSchema>,
  ): this {
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
    opts: CheckboxFieldOptions<TSchema>,
  ): this {
    this.fields.push(
      buildCheckboxField({
        id,
        title,
        ...opts,
        options: normalizeOptions(opts.options),
      }),
    )
    return this
  }

  addDateField(id: string, title: FormText, opts?: DateFieldOptions): this {
    this.fields.push(buildDateField({ id, title, ...opts }))
    return this
  }

  addFileUploadField(
    id: string,
    title: FormText,
    opts?: FileUploadFieldOptions,
  ): this {
    this.fields.push(buildFileUploadField({ id, title, ...opts }))
    return this
  }

  addSubmitField(id: string, title: FormText, opts: SubmitFieldOptions): this {
    this.fields.push(buildSubmitField({ id, title, ...opts }))
    return this
  }

  addDescriptionField(
    id: string,
    title: FormText,
    opts?: DescriptionFieldOptions,
  ): this {
    const { showWhen, ...fieldOpts } = opts ?? {}
    this.fields.push(
      buildDescriptionField({
        id,
        title,
        ...fieldOpts,
        ...(showWhen ? { condition: resolveShowWhen(showWhen) } : {}),
      }),
    )
    return this
  }

  addBankAccountField(
    id: string,
    title: FormText,
    opts?: BankAccountFieldOptions,
  ): this {
    this.fields.push(buildBankAccountField({ id, title, ...opts }))
    return this
  }

  addNationalIdWithNameField(
    id: string,
    title: FormText,
    opts?: NationalIdWithNameFieldOptions,
  ): this {
    this.fields.push(buildNationalIdWithNameField({ id, title, ...opts }))
    return this
  }

  addVehiclePermnoWithInfoField(
    id: string,
    opts: VehiclePermnoWithInfoFieldOptions,
  ): this {
    this.fields.push(buildVehiclePermnoWithInfoField({ id, ...opts }))
    return this
  }

  addOverviewField(
    id: string,
    title: FormText,
    opts?: OverviewFieldOptions,
  ): this {
    this.fields.push(buildOverviewField({ id, title, ...opts }))
    return this
  }

  addAlertMessageField(id: string, opts: AlertMessageFieldOptions): this {
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
    field.disabled = field.disabled ?? false
    field.width = field.width ?? 'full'
    this.fields.push(field)
    return this
  }

  addLinkField(id: string, title: FormText, opts?: LinkFieldOptions): this {
    const { variant, ...fieldOpts } = opts ?? {}
    const field = makeBaseField(id, title, FieldTypes.LINK, 'LinkFormField', {
      ...fieldOpts,
      doesNotRequireAnswer: opts?.doesNotRequireAnswer ?? false,
    })
    field.s3key = opts?.s3key ?? ''
    field.link = opts?.link ?? ''
    field.iconProps = opts?.iconProps
    field.variant = variant ?? 'ghost'
    field.justifyContent = opts?.justifyContent ?? 'flexStart'
    if (opts?.condition) {
      field.condition = opts.condition
    }
    field.disabled = field.disabled ?? false
    field.width = field.width ?? 'full'
    this.fields.push(field)
    return this
  }

  addExpandableDescriptionField(
    id: string,
    title: FormText,
    opts: ExpandableDescriptionFieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      title,
      FieldTypes.EXPANDABLE_DESCRIPTION,
      'ExpandableDescriptionFormField',
      {
        ...opts,
        doesNotRequireAnswer: opts.doesNotRequireAnswer ?? false,
      },
    )
    const mutableField = field as Record<string, unknown>
    mutableField.description = opts.description
    mutableField.introText = opts.introText
    mutableField.startExpanded = opts.startExpanded
    mutableField.disabled = field.disabled ?? false
    mutableField.width = field.width ?? 'full'
    this.fields.push(field)
    return this
  }

  addMessageWithLinkButtonField(
    id: string,
    opts: MessageWithLinkButtonFieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      '',
      FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
      'MessageWithLinkButtonFormField',
      {
        ...opts,
        doesNotRequireAnswer: opts.doesNotRequireAnswer ?? false,
      },
    )
    field.url = opts.url
    field.message = opts.message
    field.messageColor = opts.messageColor
    field.buttonTitle = opts.buttonTitle
    field.disabled = field.disabled ?? false
    field.width = field.width ?? 'full'
    this.fields.push(field)
    return this
  }

  addStaticTableField(
    id: string,
    title: FormText,
    opts: StaticTableFieldOptions,
  ): this {
    const { header, rows, ...fieldOpts } = opts
    const field = buildStaticTableField({
      title,
      header,
      rows,
      ...fieldOpts,
    })
    ;(field as unknown as Record<string, unknown>).id = id
    this.fields.push(field)
    return this
  }

  addTableRepeaterField(
    id: string,
    title: FormText,
    opts: TableRepeaterFieldOptions,
  ): this {
    this.fields.push(buildTableRepeaterField({ id, title, ...opts }))
    return this
  }

  addFieldsRepeaterField(
    id: string,
    title: FormText,
    opts: FieldsRepeaterFieldOptions,
  ): this {
    this.fields.push(buildFieldsRepeaterField({ id, title, ...opts }))
    return this
  }

  addPaginatedSearchableTableField(
    id: string,
    opts: PaginatedSearchableTableFieldOptions,
  ): this {
    this.fields.push(buildPaginatedSearchableTableField({ id, ...opts }))
    return this
  }

  addAccordionField(
    id: string,
    title: FormText,
    opts: AccordionFieldOptions,
  ): this {
    this.fields.push(buildAccordionField({ id, title, ...opts }))
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

  addDividerField(id: string, opts?: DividerFieldOptions): this
  addDividerField(opts?: DividerFieldOptions): this
  addDividerField(
    idOrOpts?: string | DividerFieldOptions,
    opts?: DividerFieldOptions,
  ): this {
    const fieldOpts = typeof idOrOpts === 'string' ? opts : idOrOpts
    const field = buildDividerField(fieldOpts ?? {}) as MutableField

    if (typeof idOrOpts === 'string') {
      ;(field as Record<string, unknown>).id = idOrOpts
    }

    this.fields.push(field)
    return this
  }

  addPhoneField(id: string, title: FormText, opts?: PhoneFieldOptions): this {
    this.fields.push(buildPhoneField({ id, title, ...opts }))
    return this
  }

  addKeyValueField(
    id: string,
    title: FormText,
    value: TypedFormText<TSchema> | TypedFormTextArray<TSchema>,
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
    field.value = value as FormText | FormTextArray
    this.fields.push(field)
    return this
  }

  addDisplayField(
    id: string,
    title: FormText,
    value: DisplayField['value'],
    opts?: DisplayFieldOptions,
  ): this {
    this.fields.push(buildDisplayField({ id, title, value, ...opts }))
    return this
  }

  addAsyncSelectField(
    id: string,
    title: FormText,
    opts: AsyncSelectFieldOptions,
  ): this {
    this.fields.push(buildAsyncSelectField({ id, title, ...opts }))
    return this
  }

  addCompanySearchField(
    id: string,
    title: FormText,
    opts?: CompanySearchFieldOptions,
  ): this {
    this.fields.push(buildCompanySearchField({ id, title, ...opts }))
    return this
  }

  addTitleField(title: FormText, opts?: TitleFieldOptions): this {
    this.fields.push(buildTitleField({ title, ...opts }))
    return this
  }

  addSliderField(id: string, title: FormText, opts: SliderFieldOptions): this {
    this.fields.push(buildSliderField({ id, title, ...opts }))
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

  addCustomField(
    id: string,
    title: FormText,
    componentName: string,
    props?: RecordObject,
    opts?: CustomFieldOptions,
  ): this {
    this.fields.push(
      buildCustomField({ id, title, component: componentName, ...opts }, props),
    )
    return this
  }

  getFields(): Field[] {
    return this.fields as Field[]
  }

  build(): MultiField {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.MULTI_FIELD,
      children: this.fields,
      ...this.opts,
    }
  }
}
