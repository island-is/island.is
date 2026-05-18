import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'íslenska',
  })
  readonly description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Icelandic',
  })
  readonly englishDescription!: string

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['Development', 'Staging'],
  })
  readonly environments?: string[]
}
