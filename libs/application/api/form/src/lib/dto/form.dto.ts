import {
  Condition,
  FieldComponents,
  FieldTypes,
  FormItemTypes,
  IDataProviderItem,
  IField,
  IForm,
  IFormItem,
} from '@island.is/application/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator'

type FieldValue = string | number | boolean | Date

export class FieldDto implements IField {
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

export class DataProviderItemDto implements IDataProviderItem {
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

export class FormItemDto implements IFormItem {
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

export class FormDto implements IForm {
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
