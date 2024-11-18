import { ApiProperty } from '@nestjs/swagger'

export class FormUrlDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  organizationUrlId!: string

  @ApiProperty()
  url!: string

  @ApiProperty()
  isXroad!: boolean

  @ApiProperty()
  isTest!: boolean

  @ApiProperty()
  type!: string

  @ApiProperty()
  method!: string
}
