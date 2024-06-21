import { ApiProperty } from '@nestjs/swagger'

export class UpdateInputSettingsDto {
  @ApiProperty()
  minValue?: number

  @ApiProperty()
  maxValue?: number

  @ApiProperty()
  minLength?: number

  @ApiProperty()
  maxLength?: number

  @ApiProperty()
  minDate?: Date

  @ApiProperty()
  maxDate?: Date

  @ApiProperty()
  minAmount?: string

  @ApiProperty()
  maxAmount?: string

  @ApiProperty()
  year?: number

  @ApiProperty()
  hasLink?: boolean

  @ApiProperty()
  url?: string

  @ApiProperty()
  buttonText?: string

  @ApiProperty()
  hasPropertyInput?: boolean

  @ApiProperty()
  hasPropertyList?: boolean

  @ApiProperty()
  list?: string

  @ApiProperty()
  fileTypes?: string

  @ApiProperty()
  fileMaxSize?: number

  @ApiProperty()
  maxFiles?: number

  @ApiProperty()
  timeInterval?: string
}
