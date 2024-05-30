import { ApiProperty } from '@nestjs/swagger'

export class CreateFormDto {
  @ApiProperty()
  name!: string

  @ApiProperty()
  isTranslated!: boolean
}
