import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateFieldSettingsDto {
  @ApiPropertyOptional()
  minValue?: number

  @ApiPropertyOptional()
  maxValue?: number

  @ApiPropertyOptional()
  minLength?: number

  @ApiPropertyOptional()
  maxLength?: number

  @ApiPropertyOptional()
  minDate?: Date

  @ApiPropertyOptional()
  maxDate?: Date

  @ApiPropertyOptional()
  minAmount?: string

  @ApiPropertyOptional()
  maxAmount?: string

  @ApiPropertyOptional()
  year?: number

  @ApiPropertyOptional()
  hasLink?: boolean

  @ApiPropertyOptional()
  url?: string

  @ApiPropertyOptional()
  buttonText?: string

  @ApiPropertyOptional()
  hasPropertyInput?: boolean

  @ApiPropertyOptional()
  hasPropertyList?: boolean

  @ApiPropertyOptional()
  listType?: string

  @ApiPropertyOptional()
  fileTypes?: string

  @ApiPropertyOptional()
  fileMaxSize?: number

  @ApiPropertyOptional()
  maxFiles?: number

  @ApiPropertyOptional()
  timeInterval?: string
}
