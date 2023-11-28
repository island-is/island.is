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
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger'
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

type FieldValue = string | number | boolean | Date

export class FieldDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id!: string

  @ApiProperty()
  @IsString()
  @Expose()
  title!: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  description?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  isPartOfRepeater?: boolean

  @ApiProperty({ enum: FieldTypes })
  @IsEnum(FieldTypes)
  @Expose()
  type!: FieldTypes

  @ApiProperty()
  @IsString()
  @Expose()
  @IsEnum(FieldComponents)
  component!: FieldComponents

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  disabled?: boolean

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  width?: string

  @ApiPropertyOptional()
  @IsObject()
  @Expose()
  colSpan?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  defaultValue?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  doesNotRequireAnswer?: boolean

  @ApiPropertyOptional()
  @IsObject()
  @Expose()
  specifics?: Record<string, FieldValue>
}

export class DataProviderItemDto {
  @ApiProperty()
  @IsString()
  @Expose()
  id!: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  action?: string

  @ApiPropertyOptional()
  @IsNumber()
  @Expose()
  order?: number

  @ApiProperty()
  @IsString()
  @Expose()
  title!: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  subTitle?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  pageTitle?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  source?: string
}

export class FormItemDto {
  @IsObject()
  @ApiPropertyOptional()
  condition?: Condition | undefined

  @ApiProperty()
  @Expose()
  @IsString()
  title!: string

  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty({ enum: FormItemTypes })
  @Expose()
  @IsEnum(FormItemTypes)
  type!: FormItemTypes

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  isPartOfRepeater?: boolean

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  description?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  space?: string

  @ApiProperty()
  @IsArray()
  @Expose()
  @ApiProperty({ type: [FormItemDto], default: [] })
  children!: FormItemDto[]

  @ApiPropertyOptional()
  @IsArray()
  @Expose()
  @ApiPropertyOptional({ type: [FieldDto], default: [] })
  fields?: FieldDto[]

  @ApiPropertyOptional()
  @IsNumber()
  @Expose()
  draftPageNumber?: number

  @ApiPropertyOptional({ type: [DataProviderItemDto], default: [] })
  @IsArray()
  @Expose()
  dataProviders?: DataProviderItemDto[]
}

export class FormDto {
  @ApiProperty({ type: [FormItemDto], default: [] })
  children!: FormItemDto[]

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  icon?: string

  @ApiProperty()
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

  @ApiProperty()
  @Expose()
  @IsString()
  title!: string

  @ApiProperty()
  @Expose()
  @IsString()
  type!: FormItemTypes.FORM
}

/*
export class TextField extends BaseField {
  @ApiProperty()
  @IsString()
  @Expose()
  type!: FieldTypes.TEXT

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  variant?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  backgroundColor?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  format?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  suffix?: string

  @ApiPropertyOptional()
  @IsNumber()
  @Expose()
  rows?: number

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  required?: boolean
}

export class SubmitField extends BaseField {
  @ApiProperty()
  @IsString()
  @Expose()
  type!: FieldTypes.SUBMIT

  @ApiProperty()
  @IsString()
  @Expose()
  override component!: FieldComponents.SUBMIT

  @ApiProperty()
  @IsArray()
  @Expose()
  actions!: CallToAction[]

  @ApiProperty()
  @IsString()
  @Expose()
  placement!: 'footer' | 'screen'

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  refetchApplicationAfterSubmit?: boolean
}

export class ExternalDataProvider extends FormItem {
  @ApiProperty()
  @IsArray()
  @Expose()
  dataProviders!: DataProviderItem[]

  @ApiPropertyOptional()
  @IsArray()
  @Expose()
  otherPermissions?: DataProviderPermissionItem[]

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  checkboxLabel?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  subTitle?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  description?: string

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SubmitField)
  @Expose()
  submitField?: SubmitField
}

export class RadioField extends BaseField {
  @ApiProperty()
  @IsString()
  @Expose()
  type!: FieldTypes.RADIO

  @ApiProperty()
  @IsArray()
  @Expose()
  options!: MaybeWithApplicationAndField<Option[]>

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  backgroundColor?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  largeButtons?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @Expose()
  required?: boolean

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  space?: string

  @ApiProperty()
  @IsString()
  @Expose()
  override component!: FieldComponents.RADIO
}

export class DescriptionField extends BaseField {
  @ApiProperty()
  @IsString()
  @Expose()
  type!: FieldTypes.DESCRIPTION

  @ApiProperty()
  @IsString()
  @Expose()
  override component!: FieldComponents.DESCRIPTION

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  toolTip?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  titleToolTip?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  titleVariant?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  marginBottom?: string

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  space?: string
}
*/
