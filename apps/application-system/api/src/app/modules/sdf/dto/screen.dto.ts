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
}

export class ValidateResponseDto {
  @ApiProperty({ type: [ValidationErrorDto] })
  errors!: ValidationErrorDto[]
}
