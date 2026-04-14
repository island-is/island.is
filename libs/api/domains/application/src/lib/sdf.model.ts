import {
  createUnionType,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum SdfActionType {
  NEXT_PAGE = 'NEXT_PAGE',
  PREV_PAGE = 'PREV_PAGE',
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
  types: () =>
    [SdfSingleClientCondition, SdfMultiClientCondition] as const,
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

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => [SdfSelectOption])
  options!: SdfSelectOption[]

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfCheckboxField')
export class SdfCheckboxField {
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfComponentWidth, { nullable: true })
  width?: SdfComponentWidth

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfDividerField')
export class SdfDividerField {
  @Field()
  id!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfDescriptionField')
export class SdfDescriptionField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfKeyValueField')
export class SdfKeyValueField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  value!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfAlertMessageField')
export class SdfAlertMessageField {
  @Field()
  id!: string

  @Field()
  alertType!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  message?: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfLinkField')
export class SdfLinkField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  url!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfRedirectToServicePortalField')
export class SdfRedirectToServicePortalField {
  @Field()
  id!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfPaymentPendingField')
export class SdfPaymentPendingField {
  @Field()
  id!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfActionCardListField')
export class SdfActionCardListField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfTableRepeaterField')
export class SdfTableRepeaterField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfHiddenInputField')
export class SdfHiddenInputField {
  @Field()
  id!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfHiddenInputWithWatchedValueField')
export class SdfHiddenInputWithWatchedValueField {
  @Field()
  id!: string

  @Field()
  watchValue!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfFindVehicleField')
export class SdfFindVehicleField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfDisplayField')
export class SdfDisplayField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  value?: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfImageField')
export class SdfImageField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  imageUrl?: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfBankAccountField')
export class SdfBankAccountField {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
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

  @Field(() => SdfClientCondition, { nullable: true })
  clientCondition?: typeof SdfClientCondition
}

@ObjectType('SdfCustomComponent')
export class SdfCustomComponent {
  @Field()
  componentName!: string

  @Field()
  props!: string
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
    description:
      'JSON-serialized rows of components. Parsed by the frontend.',
  })
  items!: string[]
}

const allComponentTypes = () =>
  [
    SdfTextField,
    SdfSelectField,
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
    SdfRepeaterComponent,
    SdfCustomComponent,
  ] as const

const resolveComponentTypeByName = (
  typeName: string,
): (new () => unknown) | undefined => {
  const typeMap: Record<string, new () => unknown> = {
    TEXT: SdfTextField,
    SELECT: SdfSelectField,
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
    REPEATER: SdfRepeaterComponent,
    CUSTOM: SdfCustomComponent,
  }
  return typeMap[typeName]
}

export const resolveComponentType = (
  value: Record<string, unknown>,
): string | undefined => {
  const typeName = value?.type as string | undefined
  if (typeName) {
    const cls = resolveComponentTypeByName(typeName)
    if (cls) return cls.name
  }
  if ('componentName' in value) return SdfCustomComponent.name
  if ('arrayPath' in value) return SdfRepeaterComponent.name
  return undefined
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

@ObjectType('SdfValidationError')
export class SdfValidationError {
  @Field()
  componentId!: string

  @Field()
  message!: string
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
  components!: (typeof SdfComponent)[]

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
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

@InputType('SdfGetScreenInput')
export class SdfGetScreenInput {
  @Field()
  applicationId!: string

  @Field(() => Int, { nullable: true })
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

  @Field(() => Int)
  lastKnownPageIndex!: number

  @Field(() => [String], { nullable: true })
  fieldIds?: string[]

  @Field({ nullable: true })
  event?: string
}
