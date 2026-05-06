import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// Composite-key fields are exposed via path params on the GET/PATCH/DELETE
// routes (`:language/:className/:property/:key`). Slashes in these values
// would create rows that can never be read or modified through the v2 API,
// so we reject them at the create boundary.
const NO_SLASH = /^[^/]+$/
const NO_SLASH_MESSAGE = 'must not contain "/"'

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(NO_SLASH, { message: `language ${NO_SLASH_MESSAGE}` })
  @ApiProperty({ example: 'en' })
  readonly language!: string

  @IsString()
  @IsNotEmpty()
  @Matches(NO_SLASH, { message: `className ${NO_SLASH_MESSAGE}` })
  @ApiProperty({ example: 'client' })
  readonly className!: string

  @IsString()
  @IsNotEmpty()
  @Matches(NO_SLASH, { message: `key ${NO_SLASH_MESSAGE}` })
  @ApiProperty({ example: 'island.is-1' })
  readonly key!: string

  @IsString()
  @IsNotEmpty()
  @Matches(NO_SLASH, { message: `property ${NO_SLASH_MESSAGE}` })
  @ApiProperty({ example: 'displayName' })
  readonly property!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'This is the display name in english' })
  readonly value?: string
}
