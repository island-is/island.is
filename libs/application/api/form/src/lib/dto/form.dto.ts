import {
  CallToAction,
  Condition,
  DataProviderItem,
  DataProviderPermissionItem,
  FieldComponents,
  FieldTypes,
  Form,
  FormItemTypes,
  FormText,
  MaybeWithApplicationAndField,
  Option,
} from '@island.is/application/types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'
import { FormatMessage } from '@island.is/cms-translations'

export class FormDto {
  @IsArray()
  @Expose()
  @Type(() => Object)
  @ApiPropertyOptional({ type: [Object], default: [] })
  children!: object[]

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  icon?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  id!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  logo?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  mode?: string

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  renderLastScreenBackButton?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  renderLastScreenButton?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  title!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  type!: string
}

export function formToDto(form: Form, formatMessage: FormatMessage): object {
  const dto = new FormDto()
  dto.children = form.children
  dto.icon = form.icon
  dto.id = form.id
  dto.logo = form.logo as unknown as string
  dto.mode = form.mode
  dto.renderLastScreenBackButton = form.renderLastScreenBackButton
  dto.renderLastScreenButton = form.renderLastScreenButton
  dto.title = formatMessage(form.title)
  dto.type = form.type
  return dto
}

export class FormItem {
  @IsObject()
  @ApiPropertyOptional()
  condition?: Condition | undefined

  @Expose()
  @IsString()
  title!: FormText

  @IsString()
  id!: string
}

export class Section extends FormItem {
  @IsArray()
  @Expose()
  @ValidateNested({ each: true })
  children!: Array<SubSection | MultiField>

  @Expose()
  @IsEnum(FormItemTypes)
  type!: FormItemTypes.SECTION

  @IsNumber()
  @Expose()
  draftPageNumber?: number
}

export class SubSection extends FormItem {
  @IsArray()
  @Expose()
  @ValidateNested({ each: true })
  children!: Array<FormItem>

  @Expose()
  @IsEnum(FormItemTypes)
  type!: FormItemTypes.SUB_SECTION
}

export class MultiField extends FormItem {
  @IsArray()
  @Expose()
  @ValidateNested({ each: true })
  children!: Array<BaseField>

  @Expose()
  @IsEnum(FormItemTypes)
  type!: FormItemTypes.MULTI_FIELD

  @IsBoolean()
  @Expose()
  isPartOfRepeater?: boolean

  @IsString()
  @Expose()
  description?: string

  @IsString()
  @Expose()
  space?: string
}

export class BaseField extends FormItem {
  @IsString()
  @Expose()
  override id!: string

  @IsString()
  @Expose()
  component!: string

  @IsString()
  @Expose()
  override title!: string

  @IsString()
  @Expose()
  description?: string

  children: undefined

  @IsBoolean()
  @Expose()
  disabled?: boolean

  @IsString()
  @Expose()
  width?: string

  @IsObject()
  @Expose()
  colSpan?: string

  @IsBoolean()
  @Expose()
  isPartOfRepeater?: boolean

  @IsString()
  @Expose()
  defaultValue?: string

  @IsBoolean()
  @Expose()
  doesNotRequireAnswer?: boolean
}

export class TextField extends BaseField {
  @IsString()
  @Expose()
  variant?: string

  @IsString()
  @Expose()
  backgroundColor?: string

  @IsString()
  @Expose()
  format?: string

  @IsString()
  @Expose()
  suffix?: string

  @IsNumber()
  @Expose()
  rows?: number

  @IsBoolean()
  @Expose()
  required?: boolean
}

export class SubmitField extends BaseField {
  @IsString()
  @Expose()
  type!: FieldTypes.SUBMIT

  @IsString()
  @Expose()
  override component!: FieldComponents.SUBMIT

  @IsArray()
  @Expose()
  actions!: CallToAction[]

  @IsString()
  @Expose()
  placement!: 'footer' | 'screen'

  @IsBoolean()
  @Expose()
  refetchApplicationAfterSubmit?: boolean
}

export class ExternalDataProvider extends FormItem {
  @IsArray()
  @Expose()
  dataProviders!: DataProviderItem[]

  @IsArray()
  @Expose()
  otherPermissions?: DataProviderPermissionItem[]

  @IsString()
  @Expose()
  checkboxLabel?: string

  @IsString()
  @Expose()
  subTitle?: string

  @IsString()
  @Expose()
  description?: string

  @ValidateNested()
  @Type(() => SubmitField)
  @Expose()
  submitField?: SubmitField
}

export class RadioField extends BaseField {
  @IsString()
  @Expose()
  type!: FieldTypes.RADIO

  @IsArray()
  @Expose()
  options!: MaybeWithApplicationAndField<Option[]>

  @IsString()
  @Expose()
  backgroundColor?: string

  @IsBoolean()
  @Expose()
  largeButtons?: boolean

  @IsBoolean()
  @Expose()
  required?: boolean

  @IsString()
  @Expose()
  space?: string

  @IsString()
  @Expose()
  override component!: FieldComponents.RADIO
}

export class DescriptionField extends BaseField {
  @IsString()
  @Expose()
  type!: FieldTypes.DESCRIPTION

  @IsString()
  @Expose()
  override component!: FieldComponents.DESCRIPTION

  @IsString()
  @Expose()
  toolTip?: string

  @IsString()
  @Expose()
  titleToolTip?: string

  @IsString()
  @Expose()
  titleVariant?: string

  @IsString()
  @Expose()
  marginBottom?: string

  @IsString()
  @Expose()
  space?: string
}
