import {
  createUnionType,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum SdfActionType {
  NEXT_PAGE = 'NEXT_PAGE',
  PREV_PAGE = 'PREV_PAGE',
  // Jump directly to a known page by id (e.g. the overview "Breyta"/edit
  // button). The destination page id is carried in `event`.
  GO_TO_PAGE = 'GO_TO_PAGE',
  SUBMIT = 'SUBMIT',
  REFETCH = 'REFETCH',
  VALIDATE = 'VALIDATE',
}
registerEnumType(SdfActionType, { name: 'SdfActionType' })

export enum SdfButtonVariant {
  PRIMARY = 'PRIMARY',
  GHOST = 'GHOST',
  SUBTLE = 'SUBTLE',
  REJECT = 'REJECT',
  SIGN = 'SIGN',
}
registerEnumType(SdfButtonVariant, { name: 'SdfButtonVariant' })

export enum SdfComponentWidth {
  FULL = 'FULL',
  HALF = 'HALF',
}
registerEnumType(SdfComponentWidth, { name: 'SdfComponentWidth' })

export enum SdfConditionOperator {
  ALL = 'ALL',
  ANY = 'ANY',
}
registerEnumType(SdfConditionOperator, { name: 'SdfConditionOperator' })

// ---------------------------------------------------------------------------
// ClientCondition union
// ---------------------------------------------------------------------------

@ObjectType('SdfSingleClientCondition')
export class SdfSingleClientCondition {
  @Field()
  questionId!: string

  @Field()
  comparator!: string

  @Field()
  value!: string
}

@ObjectType('SdfMultiClientCondition')
export class SdfMultiClientCondition {
  @Field(() => SdfConditionOperator)
  on!: SdfConditionOperator

  @Field(() => [SdfSingleClientCondition])
  checks!: SdfSingleClientCondition[]
}

export const SdfClientCondition = createUnionType({
  name: 'SdfClientCondition',
  types: () => [SdfSingleClientCondition, SdfMultiClientCondition] as const,
  resolveType(value) {
    if ('checks' in value) {
      return SdfMultiClientCondition
    }
    return SdfSingleClientCondition
  },
})

// ---------------------------------------------------------------------------
// Component types
// ---------------------------------------------------------------------------

@ObjectType('SdfSelectOption')
export class SdfSelectOption {
  @Field()
  label!: string

  @Field()
  value!: string
}

@ObjectType('SdfTextField')
export class SdfTextField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => Int, { nullable: true })
  maxLength?: number

  @Field({ nullable: true })
  defaultValue?: string

  /** Same values as application `TextField.variant` (`text`, `textarea`, `number`, …). */
  @Field({ nullable: true })
  inputVariant?: string

  @Field(() => Int, { nullable: true })
  textareaRows?: number

  @Field({ nullable: true })
  inputBackgroundColor?: string

  @Field({ nullable: true })
  readOnly?: boolean

  @Field({ nullable: true })
  rightAlign?: boolean

  @Field({ nullable: true })
  textFormat?: string

  @Field({ nullable: true })
  textSuffix?: string

  @Field({ nullable: true })
  showMaxLength?: boolean

  @Field({ nullable: true })
  thousandSeparator?: boolean

  @Field({ nullable: true })
  allowNegative?: boolean

  /** Number input bounds (renamed from `min`/`max` to avoid union conflict with `SdfSliderField`). */
  @Field(() => Int, { nullable: true })
  textNumberMin?: number

  @Field(() => Int, { nullable: true })
  textNumberMax?: number

  @Field({ nullable: true })
  textStep?: string

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfSelectField')
export class SdfSelectField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field()
  isMulti!: boolean

  @Field(() => [SdfSelectOption])
  options!: SdfSelectOption[]

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null

  @Field(() => [String], { nullable: true })
  onSelectRefetchTemplateApis?: string[]

  @Field(() => [String], { nullable: true })
  refetchTargets?: string[]
}

@ObjectType('SdfSearchField')
export class SdfSearchField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => [SdfSelectOption])
  options!: SdfSelectOption[]

  @Field()
  searchAction!: string

  @Field(() => Int, { nullable: true })
  minQueryLength?: number

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null

  @Field(() => [String], { nullable: true })
  onSelectRefetchTemplateApis?: string[]

  @Field(() => [String], { nullable: true })
  refetchTargets?: string[]
}

@ObjectType('SdfDataTableInput')
export class SdfDataTableInput {
  @Field()
  key!: string

  @Field({ nullable: true })
  label?: string

  @Field()
  type!: string

  @Field(() => Int, { nullable: true })
  min?: number

  @Field(() => Int, { nullable: true })
  max?: number

  @Field({ nullable: true })
  format?: string

  @Field({ nullable: true })
  suffix?: string
}

@ObjectType('SdfDataTableEditableRow')
export class SdfDataTableEditableRow {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => [String])
  cells!: string[]

  @Field()
  hasCheckbox!: boolean

  @Field({ nullable: true })
  checkboxKey?: string

  @Field(() => [SdfDataTableInput])
  inputs!: SdfDataTableInput[]

  @Field(() => graphqlTypeJson, { nullable: true })
  payload?: Record<string, unknown>

  @Field(() => graphqlTypeJson, { nullable: true })
  defaultValues?: Record<string, unknown>
}

@ObjectType('SdfDataTableExpandable')
export class SdfDataTableExpandable {
  @Field(() => [SdfDataTableEditableRow])
  rows!: SdfDataTableEditableRow[]
}

@ObjectType('SdfDataTableRow')
export class SdfDataTableRow {
  @Field()
  id!: string

  @Field(() => [String])
  cells!: string[]

  @Field(() => SdfDataTableExpandable, { nullable: true })
  expandable?: SdfDataTableExpandable
}

@ObjectType('SdfDataTableField')
export class SdfDataTableField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => [String])
  header!: string[]

  @Field(() => [SdfDataTableRow])
  rows!: SdfDataTableRow[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfRadioField')
export class SdfRadioField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => [SdfSelectOption])
  options!: SdfSelectOption[]

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfCheckboxField')
export class SdfCheckboxField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => [SdfSelectOption])
  options!: SdfSelectOption[]

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  /** Render each option with bold label styling. */
  @Field({ nullable: true })
  strong?: boolean

  /** Render each option using the tall/large checkbox variant. */
  @Field({ nullable: true })
  large?: boolean

  /** `GridColumn paddingBottom` between options (0 | 1 | 2). */
  @Field(() => Int, { nullable: true })
  spacing?: number

  /** Background color of each checkbox option (`blue` | `white`). */
  @Field({ nullable: true })
  checkboxBackgroundColor?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfDateField')
export class SdfDateField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field({ nullable: true })
  minDate?: string

  @Field({ nullable: true })
  maxDate?: string

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfFileUploadField')
export class SdfFileUploadField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => Int, { nullable: true })
  maxSize?: number

  @Field({ nullable: true })
  accept?: string

  @Field({ nullable: true })
  uploadHeader?: string

  @Field({ nullable: true })
  uploadDescription?: string

  @Field({ nullable: true })
  uploadButtonLabel?: string

  @Field({ nullable: true })
  uploadMultiple?: boolean

  @Field(() => Int, { nullable: true })
  totalMaxSize?: number

  @Field(() => Int, { nullable: true })
  maxFileCount?: number

  @Field({ nullable: true })
  forImageUpload?: boolean

  @Field({ nullable: true })
  maxSizeErrorText?: string

  @Field({ nullable: true })
  introduction?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfPhoneField')
export class SdfPhoneField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field({ nullable: true })
  defaultValue?: string

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field({ nullable: true })
  enableCountrySelector?: boolean

  @Field(() => [String], { nullable: true })
  allowedCountryCodes?: string[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfNationalIdField')
export class SdfNationalIdField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfCompanySearchField')
export class SdfCompanySearchField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfAsyncSelectField')
export class SdfAsyncSelectField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field()
  required!: boolean

  @Field()
  disabled!: boolean

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfSubmitAction')
export class SdfSubmitAction {
  @Field()
  event!: string

  @Field()
  name!: string

  @Field()
  type!: string
}

@ObjectType('SdfSubmitField')
export class SdfSubmitField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placement?: string

  @Field(() => [SdfSubmitAction])
  actions!: SdfSubmitAction[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfDividerField')
export class SdfDividerField {
  @Field()
  id!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfDescriptionField')
export class SdfDescriptionField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Int, { nullable: true })
  marginTop?: number

  @Field(() => Int, { nullable: true })
  marginBottom?: number

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfKeyValueField')
export class SdfKeyValueField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  value!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfAlertMessageField')
export class SdfAlertMessageField {
  @Field()
  id!: string

  @Field({ nullable: true })
  alertType?: string

  @Field()
  title!: string

  @Field({ nullable: true })
  message?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfLinkField')
export class SdfLinkField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  url!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfRedirectToServicePortalField')
export class SdfRedirectToServicePortalField {
  @Field()
  id!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfPaymentPendingField')
export class SdfPaymentPendingField {
  @Field()
  id!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfMessageWithLinkButtonField')
export class SdfMessageWithLinkButtonField {
  @Field()
  id!: string

  @Field()
  message!: string

  @Field()
  url!: string

  @Field()
  buttonTitle!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfExpandableDescriptionField')
export class SdfExpandableDescriptionField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  introText?: string

  @Field()
  description!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfAccordionItem')
export class SdfAccordionItem {
  @Field()
  label!: string

  @Field()
  content!: string
}

@ObjectType('SdfAccordionField')
export class SdfAccordionField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => [SdfAccordionItem])
  items!: SdfAccordionItem[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfActionCardListField')
export class SdfActionCardListField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfTableRepeaterField')
export class SdfTableRepeaterField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfStaticTableField')
export class SdfStaticTableField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => [String])
  header!: string[]

  @Field(() => [[String]])
  rows!: string[][]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfHiddenInputField')
export class SdfHiddenInputField {
  @Field()
  id!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfHiddenInputWithWatchedValueField')
export class SdfHiddenInputWithWatchedValueField {
  @Field()
  id!: string

  @Field()
  watchValue!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfFindVehicleField')
export class SdfFindVehicleField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfDisplayField')
export class SdfDisplayField {
  @Field()
  id!: string

  /** h4/h5 title rendered above the read-only Input. */
  @Field()
  label!: string

  /** Resolved display value (string representation of the computed result). */
  @Field({ nullable: true })
  value?: string

  /** Inline label rendered inside the read-only Input. */
  @Field({ nullable: true })
  displayInputLabel?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientValueExpression?: Record<string, unknown> | string | number | boolean

  /** Same semantics as `SdfTextField.inputVariant` (e.g. `currency`, `number`). */
  @Field({ nullable: true })
  inputVariant?: string

  /** Optional suffix appended to numeric values (mirrors `TextField.suffix`). */
  @Field({ nullable: true })
  textSuffix?: string

  /** Right-align the rendered value inside the Input. */
  @Field({ nullable: true })
  rightAlign?: boolean

  /** `Text` variant for the title (e.g. `h4`, `h5`). */
  @Field({ nullable: true })
  titleVariant?: string

  /** Align the half-width input to the right half of the row. */
  @Field({ nullable: true })
  halfWidthOwnline?: boolean

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfImageField')
export class SdfImageField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  imageUrl?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfBankAccountField')
export class SdfBankAccountField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfSliderField')
export class SdfSliderField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => Int)
  min!: number

  @Field(() => Int)
  max!: number

  @Field(() => Int, { nullable: true })
  step?: number

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfExternalDataProviderItem')
export class SdfExternalDataProviderItem {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  subTitle?: string
}

@ObjectType('SdfExternalDataProviderField')
export class SdfExternalDataProviderField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  subTitle?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  checkboxLabel?: string

  @Field(() => [SdfExternalDataProviderItem], { nullable: true })
  dataProviders?: SdfExternalDataProviderItem[]
}

@ObjectType('SdfTitleField')
export class SdfTitleField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfPaginatedSearchableTableField')
export class SdfPaginatedSearchableTableField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfNationalIdWithNameField')
export class SdfNationalIdWithNameField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfFieldsRepeaterField')
export class SdfFieldsRepeaterField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfOverviewItem')
export class SdfOverviewItem {
  @Field({ nullable: true })
  width?: string

  @Field({ nullable: true })
  keyText?: string

  @Field({ nullable: true })
  valueText?: string

  @Field({ nullable: true })
  inlineKeyText?: boolean

  @Field({ nullable: true })
  boldValueText?: boolean

  @Field({ nullable: true })
  lineAboveKeyText?: boolean
}

@ObjectType('SdfOverviewAttachment')
export class SdfOverviewAttachment {
  @Field({ nullable: true })
  width?: string

  @Field()
  fileName!: string

  @Field({ nullable: true })
  fileType?: string

  @Field({ nullable: true })
  fileSize?: string
}

@ObjectType('SdfOverviewField')
export class SdfOverviewField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  titleVariant?: string

  // Resolved page id to navigate to when the "Breyta" (edit) button is pressed.
  @Field({ nullable: true })
  backId?: string

  @Field({ nullable: true })
  bottomLine?: boolean

  @Field({ nullable: true })
  displayTitleAsAccordion?: boolean

  @Field(() => [SdfOverviewItem], { nullable: true })
  overviewItems?: SdfOverviewItem[]

  @Field(() => [SdfOverviewAttachment], { nullable: true })
  overviewAttachments?: SdfOverviewAttachment[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfVehiclePermnoWithInfoField')
export class SdfVehiclePermnoWithInfoField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfInformationCardItem')
export class SdfInformationCardItem {
  @Field()
  label!: string

  @Field()
  value!: string
}

@ObjectType('SdfInformationCardField')
export class SdfInformationCardField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => [SdfInformationCardItem])
  informationCardItems!: SdfInformationCardItem[]

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfPaymentChargeLine')
export class SdfPaymentChargeLine {
  @Field()
  description!: string

  @Field({ nullable: true })
  quantity?: string

  @Field()
  amount!: string
}

@ObjectType('SdfPaymentChargeOverviewField')
export class SdfPaymentChargeOverviewField {
  @Field()
  id!: string

  @Field()
  paymentChargeHeading!: string

  @Field(() => [SdfPaymentChargeLine])
  paymentChargeLines!: SdfPaymentChargeLine[]

  @Field()
  paymentChargeTotalLabel!: string

  @Field()
  paymentChargeTotalAmount!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfPdfLinkButtonField')
export class SdfPdfLinkButtonField {
  @Field()
  id!: string

  @Field()
  pdfDescription!: string

  @Field()
  pdfLinkTitle!: string

  @Field()
  pdfLinkUrl!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfCopyLinkField')
export class SdfCopyLinkField {
  @Field()
  id!: string

  @Field({ nullable: true })
  copyLinkTitle?: string

  @Field()
  copyLinkText!: string

  @Field({ nullable: true })
  copyButtonTitle?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null
}

@ObjectType('SdfCustomComponent')
export class SdfCustomComponent {
  @Field({ nullable: true })
  componentName?: string

  @Field({ nullable: true })
  props?: string
}

// RepeaterComponent must be declared before the union to avoid forward-reference errors.
// The circular reference (items → SdfComponent → SdfRepeaterComponent) is handled
// via NestJS/GraphQL's lazy type resolution using arrow functions.
@ObjectType('SdfRepeaterComponent')
export class SdfRepeaterComponent {
  @Field()
  id!: string

  @Field()
  arrayPath!: string

  @Field()
  addItemLabel!: string

  @Field({ nullable: true })
  removeItemLabel?: string

  @Field(() => Int, { nullable: true })
  minItems?: number

  @Field(() => Int, { nullable: true })
  maxItems?: number

  // Items field uses a lazy type reference to break the circular dependency.
  // Each item is an array of components (one row of the repeater).
  @Field(() => [String], {
    description: 'JSON-serialized rows of components. Parsed by the frontend.',
  })
  items!: string[]
}

const allComponentTypes = () =>
  [
    SdfTextField,
    SdfSearchField,
    SdfSelectField,
    SdfDataTableField,
    SdfRadioField,
    SdfCheckboxField,
    SdfDateField,
    SdfFileUploadField,
    SdfPhoneField,
    SdfNationalIdField,
    SdfCompanySearchField,
    SdfAsyncSelectField,
    SdfSubmitField,
    SdfDividerField,
    SdfDescriptionField,
    SdfKeyValueField,
    SdfAlertMessageField,
    SdfLinkField,
    SdfRedirectToServicePortalField,
    SdfPaymentPendingField,
    SdfMessageWithLinkButtonField,
    SdfExpandableDescriptionField,
    SdfAccordionField,
    SdfActionCardListField,
    SdfTableRepeaterField,
    SdfStaticTableField,
    SdfHiddenInputField,
    SdfHiddenInputWithWatchedValueField,
    SdfFindVehicleField,
    SdfDisplayField,
    SdfImageField,
    SdfBankAccountField,
    SdfSliderField,
    SdfExternalDataProviderField,
    SdfTitleField,
    SdfPaginatedSearchableTableField,
    SdfNationalIdWithNameField,
    SdfFieldsRepeaterField,
    SdfOverviewField,
    SdfVehiclePermnoWithInfoField,
    SdfInformationCardField,
    SdfPaymentChargeOverviewField,
    SdfPdfLinkButtonField,
    SdfCopyLinkField,
    SdfRepeaterComponent,
    SdfCustomComponent,
  ] as const

const resolveComponentTypeByName = (
  typeName: string,
): (new () => unknown) | undefined => {
  const typeMap: Record<string, new () => unknown> = {
    TEXT: SdfTextField,
    EMAIL: SdfTextField,
    SEARCH: SdfSearchField,
    SELECT: SdfSelectField,
    DATA_TABLE: SdfDataTableField,
    RADIO: SdfRadioField,
    CHECKBOX: SdfCheckboxField,
    DATE: SdfDateField,
    FILEUPLOAD: SdfFileUploadField,
    PHONE: SdfPhoneField,
    NATIONAL_ID: SdfNationalIdField,
    COMPANY_SEARCH: SdfCompanySearchField,
    ASYNC_SELECT: SdfAsyncSelectField,
    SUBMIT: SdfSubmitField,
    DIVIDER: SdfDividerField,
    DESCRIPTION: SdfDescriptionField,
    KEY_VALUE: SdfKeyValueField,
    ALERT_MESSAGE: SdfAlertMessageField,
    LINK: SdfLinkField,
    REDIRECT_TO_SERVICE_PORTAL: SdfRedirectToServicePortalField,
    PAYMENT_PENDING: SdfPaymentPendingField,
    MESSAGE_WITH_LINK_BUTTON: SdfMessageWithLinkButtonField,
    MESSAGE_WITH_LINK_BUTTON_FIELD: SdfMessageWithLinkButtonField,
    EXPANDABLE_DESCRIPTION: SdfExpandableDescriptionField,
    ACCORDION: SdfAccordionField,
    ACTION_CARD_LIST: SdfActionCardListField,
    TABLE_REPEATER: SdfTableRepeaterField,
    STATIC_TABLE: SdfStaticTableField,
    HIDDEN_INPUT: SdfHiddenInputField,
    HIDDEN_INPUT_WITH_WATCHED_VALUE: SdfHiddenInputWithWatchedValueField,
    FIND_VEHICLE: SdfFindVehicleField,
    DISPLAY: SdfDisplayField,
    IMAGE: SdfImageField,
    BANK_ACCOUNT: SdfBankAccountField,
    SLIDER: SdfSliderField,
    EXTERNAL_DATA_PROVIDER: SdfExternalDataProviderField,
    TITLE: SdfTitleField,
    PAGINATED_SEARCHABLE_TABLE: SdfPaginatedSearchableTableField,
    NATIONAL_ID_WITH_NAME: SdfNationalIdWithNameField,
    FIELDS_REPEATER: SdfFieldsRepeaterField,
    OVERVIEW: SdfOverviewField,
    VEHICLE_PERMNO_WITH_INFO: SdfVehiclePermnoWithInfoField,
    VEHICLE_RADIO: SdfRadioField,
    VEHICLE_SELECT: SdfSelectField,
    REPEATER: SdfRepeaterComponent,
    CUSTOM: SdfCustomComponent,
    INFORMATION_CARD: SdfInformationCardField,
    PAYMENT_CHARGE_OVERVIEW: SdfPaymentChargeOverviewField,
    PDF_LINK_BUTTON: SdfPdfLinkButtonField,
    COPY_LINK: SdfCopyLinkField,
  }
  return typeMap[typeName]
}

export const resolveComponentType = (
  value: Record<string, unknown>,
): string => {
  const typeName = value?.type as string | undefined
  if (typeName) {
    const cls = resolveComponentTypeByName(typeName)
    if (cls) return cls.name
  }
  if (
    typeof value?.componentName === 'string' &&
    value.componentName.length > 0
  ) {
    return SdfCustomComponent.name
  }
  if (typeof value?.arrayPath === 'string' && value.arrayPath.length > 0) {
    return SdfRepeaterComponent.name
  }
  return SdfCustomComponent.name
}

export const SdfComponent = createUnionType({
  name: 'SdfComponent',
  types: allComponentTypes,
  resolveType(value) {
    return resolveComponentType(value as Record<string, unknown>)
  },
})

// ---------------------------------------------------------------------------
// Validation / Page / Stepper / Footer / Header / Screen
// ---------------------------------------------------------------------------

/**
 * REST VALIDATE payload from application-system-api (OpenAPI `ValidateResponseDto`).
 * Defined here so `build-graphql-schema` compiles when `gen/fetch` lags behind
 * backend OpenAPI changes.
 */
export type SdfValidateResponseShape = {
  errors: Array<{ componentId: string; message: string }>
  displayValues?: Record<string, string>
}

@ObjectType('SdfValidationError')
export class SdfValidationError {
  @Field()
  componentId!: string

  @Field()
  message!: string
}

/**
 * Response for the VALIDATE action. Unlike other actions, VALIDATE does not
 * return a fresh screen — only validation errors and live-computed display
 * values for `SdfDisplayField` components on the current page.
 */
@ObjectType('SdfValidateResult')
export class SdfValidateResult {
  @Field(() => [SdfValidationError])
  errors!: SdfValidationError[]

  /**
   * Map of display-field id → live-computed value (JSON object of `string`
   * values). Undefined when no display fields exist on the current page.
   */
  @Field(() => graphqlTypeJson, { nullable: true })
  displayValues?: Record<string, string>
}

@ObjectType('SdfPage')
export class SdfPage {
  @Field()
  id!: string

  @Field(() => Int)
  index!: number

  @Field(() => Int)
  sectionIndex!: number

  @Field(() => Int)
  subSectionIndex!: number

  @Field(() => [SdfComponent])
  components!: typeof SdfComponent[]

  @Field(() => [SdfValidationError])
  errors!: SdfValidationError[]
}

@ObjectType('SdfStepperSubSection')
export class SdfStepperSubSection {
  @Field()
  id!: string

  @Field()
  title!: string
}

@ObjectType('SdfStepperSection')
export class SdfStepperSection {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  isComplete!: boolean

  @Field(() => [SdfStepperSubSection])
  children!: SdfStepperSubSection[]
}

@ObjectType('SdfStepper')
export class SdfStepper {
  @Field(() => [SdfStepperSection])
  sections!: SdfStepperSection[]

  @Field(() => Int)
  activeSectionIndex!: number

  @Field(() => Int)
  activeSubSectionIndex!: number
}

@ObjectType('SdfFooterButton')
export class SdfFooterButton {
  @Field()
  id!: string

  @Field()
  text!: string

  @Field()
  variant!: string

  @Field()
  actionType!: string
}

@ObjectType('SdfFooter')
export class SdfFooter {
  @Field(() => [SdfFooterButton])
  buttons!: SdfFooterButton[]

  @Field()
  canGoBack!: boolean
}

@ObjectType('SdfHeader')
export class SdfHeader {
  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  applicationName?: string

  @Field({ nullable: true })
  institutionName?: string

  @Field({ nullable: true })
  logo?: string
}

@ObjectType('SdfScreen')
export class SdfScreen {
  @Field()
  applicationId!: string

  @Field(() => SdfHeader)
  header!: SdfHeader

  @Field(() => SdfStepper)
  stepper!: SdfStepper

  @Field(() => SdfPage)
  page!: SdfPage

  @Field(() => SdfFooter)
  footer!: SdfFooter

  @Field()
  locale!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  answers?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

@InputType('SdfGetScreenInput')
export class SdfGetScreenInput {
  @Field()
  applicationId!: string

  @Field(() => Int, {
    nullable: true,
    description:
      'Optional override for deep-linking. Omit to use the persisted page index.',
    deprecationReason:
      'The backend now tracks page index in the database. Only use for deep-link overrides.',
  })
  step?: number
}

@InputType('SdfExecuteActionInput')
export class SdfExecuteActionInput {
  @Field()
  applicationId!: string

  @Field(() => SdfActionType)
  actionType!: SdfActionType

  @Field({ nullable: true })
  answers?: string

  @Field(() => Int, {
    nullable: true,
    deprecationReason: 'The backend now tracks page index in the database.',
  })
  lastKnownPageIndex?: number

  @Field(() => [String], { nullable: true })
  fieldIds?: string[]

  @Field({ nullable: true })
  event?: string

  @Field(() => [String], { nullable: true })
  refetchTemplateApiActions?: string[]
}
