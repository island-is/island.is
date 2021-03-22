import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LanguageDTO {
  @IsString()
  @ApiProperty({
    example: 'is',
  })
  isoKey!: string

  @IsString()
  @ApiProperty({
    example: 'íslenska',
  })
  description!: string

  @IsString()
  @ApiProperty({
    example: 'Icelandic',
  })
  englishDescription!: string
}
