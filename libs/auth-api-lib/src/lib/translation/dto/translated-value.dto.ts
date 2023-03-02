import { ApiProperty } from '@nestjs/swagger'

export class TranslatedValueDto {
  @ApiProperty({
    description: 'The locale of the translated value',
    example: 'is',
  })
  locale!: string

  @ApiProperty({
    description: 'The translated value',
  })
  value!: string
}
