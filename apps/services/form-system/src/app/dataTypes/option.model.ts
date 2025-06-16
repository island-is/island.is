import { ApiProperty } from '@nestjs/swagger'

export class Option {
  @ApiProperty()
  value!: string

  @ApiProperty()
  label!: string

  @ApiProperty()
  isSelected!: boolean
}
