import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SingleClientConditionDto {
  @ApiProperty()
  questionId!: string

  @ApiProperty()
  comparator!: string

  @ApiProperty()
  value!: string
}

export class MultiClientConditionDto {
  @ApiProperty()
  type!: 'multi'

  @ApiProperty({ enum: ['all', 'any'] })
  on!: 'all' | 'any'

  @ApiProperty({ type: [SingleClientConditionDto] })
  checks!: SingleClientConditionDto[]
}

export type DataTableInputDto = {
  key: string
  label?: string
  type: 'text' | 'number'
  min?: number
  max?: number
  format?: string
  suffix?: string
}

export type DataTableEditableRowDto = {
  id: string
  label: string
  cells: string[]
  hasCheckbox: boolean
  checkboxKey?: string
  inputs: DataTableInputDto[]
  payload?: Record<string, unknown>
  defaultValues?: Record<string, unknown>
}

export type DataTableRowDto = {
  id: string
  cells: string[]
  expandable?: {
    rows: DataTableEditableRowDto[]
  }
}

export class ValidationErrorDto {
  @ApiProperty()
  componentId!: string

  @ApiProperty()
  message!: string
}

/**
 * Generic REST component DTO. The GraphQL gateway exposes this as a typed union;
 * the REST layer keeps one transport DTO mirroring the legacy form AST where
 * field props vary by `type`.
 */
export class ComponentDto {
  @ApiProperty({
    description:
      'Component id. This matches the application answer key for input fields.',
    example: 'propertyInfo.categoryType',
  })
  id!: string

  @ApiProperty({
    description:
      'SDF component discriminator. The GraphQL gateway maps this to Sdf*Field typenames.',
    example: 'SELECT',
  })
  type!: string

  @ApiPropertyOptional({
    description: 'Resolved, locale-specific component label.',
    example: 'Tegund leiguhúsnæðis',
  })
  label?: string

  @ApiPropertyOptional({
    description: 'Resolved, locale-specific placeholder text.',
    example: 'Veldu tegund',
  })
  placeholder?: string

  @ApiPropertyOptional({
    description: 'Whether the component must be answered before continuing.',
  })
  required?: boolean

  @ApiPropertyOptional({
    description:
      'Whether the component is read-only for the current role/state.',
  })
  disabled?: boolean

  @ApiPropertyOptional({
    description: 'Default value emitted by the template field definition.',
  })
  defaultValue?: unknown

  @ApiPropertyOptional({
    description: 'Design-system width hint.',
    enum: ['FULL', 'HALF'],
  })
  width?: string

  @ApiPropertyOptional({
    description: 'Client-evaluable visibility expression.',
  })
  clientShowWhen?: Record<string, unknown> | string | number | boolean | null

  @ApiPropertyOptional()
  options?: unknown

  @ApiPropertyOptional({
    description: 'Whether a select component accepts multiple values.',
  })
  isMulti?: boolean

  /** Phone field: show the country-code dropdown selector. */
  @ApiPropertyOptional()
  enableCountrySelector?: boolean

  /** Phone field: restrict the country-code options. */
  @ApiPropertyOptional({ type: [String] })
  allowedCountryCodes?: string[]

  @ApiPropertyOptional({
    description:
      'Template API actions to run when this select changes (SDF inline REFETCH).',
    type: [String],
  })
  onSelectRefetchTemplateApis?: string[]

  @ApiPropertyOptional({
    description:
      'Component ids that should show loading UI while this inline REFETCH is pending.',
    type: [String],
  })
  refetchTargets?: string[]

  @ApiPropertyOptional({
    description:
      'Template API action to run while searching generic SDF search fields.',
  })
  searchAction?: string

  @ApiPropertyOptional()
  minQueryLength?: number

  @ApiPropertyOptional()
  title?: string

  @ApiPropertyOptional()
  message?: string

  @ApiPropertyOptional()
  alertType?: string

  @ApiPropertyOptional()
  value?: string

  @ApiPropertyOptional()
  url?: string

  @ApiPropertyOptional()
  buttonTitle?: string

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  subTitle?: string

  @ApiPropertyOptional()
  checkboxLabel?: string

  @ApiPropertyOptional({ type: [Object] })
  dataProviders?: Array<{
    id: string
    title: string
    subTitle?: string
  }>

  @ApiPropertyOptional()
  introText?: string

  @ApiPropertyOptional()
  placement?: string

  @ApiPropertyOptional({ type: [Object] })
  actions?: Array<{ event: string; name: string; type: string }>

  @ApiPropertyOptional()
  watchValue?: string

  @ApiPropertyOptional()
  min?: number

  @ApiPropertyOptional()
  max?: number

  @ApiPropertyOptional()
  step?: number

  @ApiPropertyOptional()
  minDate?: string

  @ApiPropertyOptional()
  maxDate?: string

  @ApiPropertyOptional()
  maxLength?: number

  /** Mirrors `TextField.variant` (e.g. `textarea`, `number`). */
  @ApiPropertyOptional()
  inputVariant?: string

  /** Mirrors `TextField.rows` when `inputVariant` is `textarea`. */
  @ApiPropertyOptional()
  textareaRows?: number

  /** Mirrors `TextField.backgroundColor` (`blue` | `white`). */
  @ApiPropertyOptional({ enum: ['blue', 'white'] })
  inputBackgroundColor?: 'blue' | 'white'

  @ApiPropertyOptional()
  readOnly?: boolean

  @ApiPropertyOptional()
  rightAlign?: boolean

  /** Checkbox field: render `<Checkbox strong>` label styling. */
  @ApiPropertyOptional()
  strong?: boolean

  /** Checkbox field: render `<Checkbox large>`. */
  @ApiPropertyOptional()
  large?: boolean

  /** Checkbox field: `GridColumn paddingBottom` between options. */
  @ApiPropertyOptional({ enum: [0, 1, 2] })
  spacing?: 0 | 1 | 2

  /** Checkbox field: per-option background, distinct from `inputBackgroundColor`. */
  @ApiPropertyOptional({ enum: ['blue', 'white'] })
  checkboxBackgroundColor?: 'blue' | 'white'

  /** String `TextField.format` only (functions are not serializable). */
  @ApiPropertyOptional()
  textFormat?: string

  @ApiPropertyOptional()
  textSuffix?: string

  @ApiPropertyOptional()
  showMaxLength?: boolean

  @ApiPropertyOptional()
  thousandSeparator?: boolean

  @ApiPropertyOptional()
  allowNegative?: boolean

  /** Number input min (distinct from slider `min` to avoid ambiguous JSON). */
  @ApiPropertyOptional()
  textNumberMin?: number

  /** Number input max (distinct from slider `max`). */
  @ApiPropertyOptional()
  textNumberMax?: number

  /** HTML `step` for number/text numeric inputs (distinct from slider `step`). */
  @ApiPropertyOptional()
  textStep?: string

  @ApiPropertyOptional()
  maxSize?: number

  @ApiPropertyOptional()
  accept?: string

  @ApiPropertyOptional()
  uploadHeader?: string

  @ApiPropertyOptional()
  uploadDescription?: string

  @ApiPropertyOptional()
  uploadButtonLabel?: string

  @ApiPropertyOptional()
  uploadMultiple?: boolean

  @ApiPropertyOptional()
  totalMaxSize?: number

  @ApiPropertyOptional()
  maxFileCount?: number

  @ApiPropertyOptional()
  forImageUpload?: boolean

  @ApiPropertyOptional()
  maxSizeErrorText?: string

  @ApiPropertyOptional()
  introduction?: string

  @ApiPropertyOptional()
  imageUrl?: string

  @ApiPropertyOptional({ type: [String] })
  header?: string[]

  @ApiPropertyOptional()
  rows?: string[][] | DataTableRowDto[]

  @ApiPropertyOptional({ type: [Object] })
  items?: Array<{ label: string; content: string }>

  @ApiPropertyOptional({
    description: 'Serialized props for custom components.',
  })
  props?: string

  @ApiPropertyOptional({ description: 'Component name for custom components.' })
  componentName?: string

  @ApiPropertyOptional()
  children?: ComponentDto[][]

  @ApiPropertyOptional()
  arrayPath?: string

  @ApiPropertyOptional()
  addItemLabel?: string

  @ApiPropertyOptional()
  removeItemLabel?: string

  @ApiPropertyOptional()
  minItems?: number

  @ApiPropertyOptional()
  maxItems?: number

  @ApiPropertyOptional({ type: [Object] })
  informationCardItems?: Array<{ label: string; value: string }>

  /** Overview field: resolved page id to navigate to on "Breyta" (edit). */
  @ApiPropertyOptional()
  backId?: string

  /** Overview field: hide the bottom divider. */
  @ApiPropertyOptional()
  bottomLine?: boolean

  /** Overview field: render the title/items inside an accordion. */
  @ApiPropertyOptional()
  displayTitleAsAccordion?: boolean

  @ApiPropertyOptional({ type: [Object] })
  overviewItems?: Array<{
    width?: string
    keyText?: string
    valueText?: string
    inlineKeyText?: boolean
    boldValueText?: boolean
    lineAboveKeyText?: boolean
  }>

  @ApiPropertyOptional({ type: [Object] })
  overviewAttachments?: Array<{
    width?: string
    fileName: string
    fileType?: string
    fileSize?: string
  }>

  @ApiPropertyOptional()
  paymentChargeHeading?: string

  @ApiPropertyOptional({ type: [Object] })
  paymentChargeLines?: Array<{
    description: string
    quantity?: string
    amount: string
  }>

  @ApiPropertyOptional()
  paymentChargeTotalLabel?: string

  @ApiPropertyOptional()
  paymentChargeTotalAmount?: string

  @ApiPropertyOptional()
  pdfDescription?: string

  @ApiPropertyOptional()
  pdfLinkTitle?: string

  @ApiPropertyOptional()
  pdfLinkUrl?: string

  @ApiPropertyOptional()
  copyLinkTitle?: string

  @ApiPropertyOptional()
  copyLinkText?: string

  @ApiPropertyOptional()
  copyButtonTitle?: string

  /** Display field: `Text variant` used for the h4/h5 title (e.g. `h4`, `h5`). */
  @ApiPropertyOptional()
  titleVariant?: string

  /** Display field: align the read-only input to the right half of the row. */
  @ApiPropertyOptional()
  halfWidthOwnline?: boolean

  /** Display field: inline label inside the read-only Input (distinct from `label`). */
  @ApiPropertyOptional()
  displayInputLabel?: string

  /** Display field: expression the client can evaluate without a backend round-trip. */
  @ApiPropertyOptional()
  clientValueExpression?: Record<string, unknown> | string | number | boolean

  /** Vertical spacing in design-system units. */
  @ApiPropertyOptional()
  marginTop?: number

  @ApiPropertyOptional()
  marginBottom?: number
}

export class PageDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  index!: number

  @ApiProperty()
  sectionIndex!: number

  @ApiProperty()
  subSectionIndex!: number

  @ApiProperty({ type: [ComponentDto] })
  components!: ComponentDto[]

  @ApiProperty({ type: [ValidationErrorDto] })
  errors!: ValidationErrorDto[]
}

export class StepperSubSectionDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  title!: string
}

export class StepperSectionDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  title!: string

  @ApiProperty()
  isComplete!: boolean

  @ApiProperty({ type: [StepperSubSectionDto] })
  children!: StepperSubSectionDto[]
}

export class StepperDto {
  @ApiProperty({ type: [StepperSectionDto] })
  sections!: StepperSectionDto[]

  @ApiProperty()
  activeSectionIndex!: number

  @ApiProperty()
  activeSubSectionIndex!: number
}

export class FooterButtonDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  text!: string

  @ApiProperty()
  variant!: string

  @ApiProperty()
  actionType!: string
}

export class FooterDto {
  @ApiProperty({ type: [FooterButtonDto] })
  buttons!: FooterButtonDto[]

  @ApiProperty()
  canGoBack!: boolean
}

export class HeaderDto {
  @ApiProperty()
  title!: string

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  applicationName?: string

  @ApiPropertyOptional()
  institutionName?: string

  @ApiPropertyOptional({
    description:
      'Export name of the form logo component (e.g. "HmsLogo"). The client maps this to a component from @island.is/application/assets/institution-logos.',
  })
  logo?: string
}

export class ScreenDto {
  @ApiProperty()
  applicationId!: string

  @ApiProperty()
  header!: HeaderDto

  @ApiProperty()
  stepper!: StepperDto

  @ApiProperty()
  page!: PageDto

  @ApiProperty()
  footer!: FooterDto

  @ApiProperty()
  locale!: string

  @ApiPropertyOptional({
    description: 'Persisted answers for the current page fields',
  })
  answers?: Record<string, unknown>
}

export class ValidateResponseDto {
  @ApiProperty({ type: [ValidationErrorDto] })
  errors!: ValidationErrorDto[]

  /**
   * Live-computed display values for `FieldTypes.DISPLAY` fields on the page,
   * keyed by field id. Computed from the client's merged answers; never persisted.
   */
  @ApiPropertyOptional({
    type: Object,
    description:
      'Map of display-field id → computed display value (string). Undefined when no display fields on the page.',
  })
  displayValues?: Record<string, string>
}
