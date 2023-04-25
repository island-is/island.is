import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class TranslatedValueDto {
  @ApiProperty({
    description: 'The locale of the translated value',
    example: 'is',
  })
  @IsString()
  locale!: string

  @ApiProperty({
    description: 'The translated value',
  })
  @IsString()
  value!: string
}
