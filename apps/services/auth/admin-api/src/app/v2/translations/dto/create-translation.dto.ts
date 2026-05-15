import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'en' })
  readonly language!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'client' })
  readonly className!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'island.is-1' })
  readonly key!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'displayName' })
  readonly property!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'This is the display name in english' })
  readonly value?: string
}
