import {
  AllOrAny,
  Comparators,
  Condition,
  DynamicCheck,
  Field,
  FieldTypes,
  FormItemTypes,
  MultiField,
  StaticCheck,
  FormText,
} from '@island.is/application/types'
import { BoxProps } from '@island.is/island-ui/core/types'

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
}

type OptionList = Array<string | { label: string; value: string }>
type DynamicOptions = (application: any) => OptionList

interface RadioSelectOptions extends FieldOptions {
  options: OptionList | DynamicOptions
}

/** Select-only: template API `action` names to run on SDF REFETCH when the value changes. */
interface SelectFieldOptions extends RadioSelectOptions {
  onSelectRefetch?: string[]
}

function toStaticCheck(c: SimpleCondition): StaticCheck {
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

function resolveShowWhen(showWhen: ShowWhen): Condition {
  if (typeof showWhen === 'function') {
    return showWhen
  }

  if ('all' in showWhen || 'any' in showWhen) {
    const checks = 'all' in showWhen ? showWhen.all : (showWhen as { any: SimpleCondition[] }).any
    return {
      isMultiCheck: true,
      show: true,
      on: 'all' in showWhen ? AllOrAny.ALL : AllOrAny.ANY,
      check: checks.map(toStaticCheck),
    }
  }

  return toStaticCheck(showWhen as SimpleCondition)
}

function normalizeOptions(
  options: OptionList | DynamicOptions,
): OptionList | DynamicOptions {
  if (typeof options === 'function') {
    return (app: any) => {
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

function resolveWidth(
  width?: 'full' | 'half',
): 'full' | 'half' | undefined {
  return width
}

function makeBaseField(
  id: string,
  title: FormText,
  type: FieldTypes,
  component: string,
  opts?: FieldOptions,
): Field {
  const field = {
    id,
    title: title ?? '',
    type,
    component,
    children: undefined,
  } as unknown as Field & Record<string, unknown>

  if (opts?.showWhen) {
    ;(field as any).condition = resolveShowWhen(opts.showWhen)
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

  if (opts?.description !== undefined) {
    ;(field as any).description = opts.description
  }

  if (opts?.placeholder !== undefined) {
    ;(field as any).placeholder = opts.placeholder
  }

  if (opts?.required !== undefined) {
    ;(field as any).required = opts.required
  }

  if (opts?.variant !== undefined) {
    ;(field as any).variant = opts.variant
  }

  return field
}

export class PageBuilder<TSchema = unknown> {
  private fields: Field[] = []
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

  addRadioField(id: string, title: FormText, opts?: RadioSelectOptions): this {
    const field = makeBaseField(id, title, FieldTypes.RADIO, 'RadioFormField', opts)
    if (opts?.options) {
      ;(field as any).options = normalizeOptions(opts.options)
    }
    this.fields.push(field)
    return this
  }

  addSelectField(id: string, title: FormText, opts?: SelectFieldOptions): this {
    const field = makeBaseField(id, title, FieldTypes.SELECT, 'SelectFormField', opts)
    if (opts?.options) {
      ;(field as any).options = normalizeOptions(opts.options)
    }
    if (opts?.onSelectRefetch?.length) {
      ;(field as any).inlineRefetchTemplateApis = opts.onSelectRefetch
    }
    this.fields.push(field)
    return this
  }

  addCheckboxField(id: string, title: FormText, opts?: RadioSelectOptions): this {
    const field = makeBaseField(id, title, FieldTypes.CHECKBOX, 'CheckboxFormField', opts)
    if (opts?.options) {
      ;(field as any).options = normalizeOptions(opts.options)
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
      makeBaseField(id, title, FieldTypes.FILEUPLOAD, 'FileUploadFormField', opts),
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
      makeBaseField(id, title, FieldTypes.DESCRIPTION, 'DescriptionFormField', opts),
    )
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
    const field = makeBaseField(id, title, FieldTypes.KEY_VALUE, 'KeyValueFormField', {
      ...opts,
      doesNotRequireAnswer: true,
    })
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
    const field = makeBaseField(id, title, FieldTypes.DISPLAY, 'DisplayFormField', {
      ...opts,
      doesNotRequireAnswer: true,
    })
    ;(field as any).value = value
    this.fields.push(field)
    return this
  }

  addCustomComponent(
    id: string,
    componentName: string,
    opts?: FieldOptions,
  ): this {
    const field = makeBaseField(
      id,
      '',
      FieldTypes.CUSTOM,
      componentName,
      opts,
    )
    this.fields.push(field)
    return this
  }

  build(): MultiField {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.MULTI_FIELD,
      children: this.fields,
    }
  }
}
