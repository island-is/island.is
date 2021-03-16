import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class TranslationDTO {
  @IsString()
  @ApiProperty({
    example: 'en',
  })
  language!: boolean

  @IsString()
  @ApiProperty({
    example: 'client',
  })
  className!: boolean

  @IsString()
  @ApiProperty({
    example: 'island.is-1',
  })
  key!: string

  @IsString()
  @ApiProperty({
    example: 'displayName',
  })
  field!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a the display name in english',
  })
  value?: string
}
