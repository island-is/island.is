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

//TODO:Define a base plus one DTO per component kind, e.g. TextComponentDto,
// SliderComponentDto, … with a shared type (or kind) discriminator.
export class ComponentDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  type!: string

  @ApiPropertyOptional()
  label?: string

  @ApiPropertyOptional()
  placeholder?: string

  @ApiPropertyOptional()
  required?: boolean

  @ApiPropertyOptional()
  disabled?: boolean

  @ApiPropertyOptional()
  defaultValue?: unknown

  @ApiPropertyOptional()
  width?: string

  @ApiPropertyOptional()
  clientCondition?: SingleClientConditionDto | MultiClientConditionDto | null

  @ApiPropertyOptional()
  options?: unknown

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

  /**
   * Checkbox field: background color of each option. Distinct from
   * `inputBackgroundColor` (text-field specific) to avoid JSON collisions.
   */
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

  /** Display field: when true, render the read-only input aligned to the right half of the row. */
  @ApiPropertyOptional()
  halfWidthOwnline?: boolean

  /** Display field: inline label rendered inside the read-only Input (distinct from the h4 title which uses `label`). */
  @ApiPropertyOptional()
  displayInputLabel?: string

  /** Optional vertical spacing (design system spacing units), e.g. description fields. */
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
   * Live-computed display values for `FieldTypes.DISPLAY` fields on the current
   * page, keyed by field id. Computed from the merged answers sent by the
   * client — never persisted. Side-effect free (Constraint 1).
   */
  @ApiPropertyOptional({
    type: Object,
    description:
      'Map of display-field id → computed display value (string). Undefined when no display fields on the page.',
  })
  displayValues?: Record<string, string>
}
