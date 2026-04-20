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

export class ValidationErrorDto {
  @ApiProperty()
  componentId!: string

  @ApiProperty()
  message!: string
}

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
  rows?: string[][]

  @ApiPropertyOptional({ type: [Object] })
  items?: Array<{ label: string; content: string }>

  @ApiPropertyOptional({ description: 'Serialized props for custom components.' })
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

  @ApiPropertyOptional({ description: 'Persisted answers for the current page fields' })
  answers?: Record<string, unknown>
}

export class ValidateResponseDto {
  @ApiProperty({ type: [ValidationErrorDto] })
  errors!: ValidationErrorDto[]
}
