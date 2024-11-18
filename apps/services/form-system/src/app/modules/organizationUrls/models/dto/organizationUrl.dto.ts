import { ApiProperty } from '@nestjs/swagger'

export class OrganizationUrlDto {
  @ApiProperty()
  id!: string

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
