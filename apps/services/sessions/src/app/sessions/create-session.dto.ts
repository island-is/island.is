import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class CreateSessionDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The IDS session ID. Deprecated, use sessionId instead.',
    deprecated: true,
  })
  // Todo: Remove when we have migrated IDS to use sessionId
  id?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The IDS session ID',
  })
  sessionId!: string

  @IsString()
  @ApiProperty()
  actorNationalId!: string

  @IsString()
  @ApiProperty()
  subjectNationalId!: string

  @IsString()
  @ApiProperty()
  clientId!: string

  @IsDateString()
  @ApiProperty()
  timestamp!: Date

  @IsString()
  @ApiProperty()
  userAgent!: string

  @IsString()
  @ApiProperty()
  ip!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'ISO 3166-1 alpha-2 country code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2',
  })
  ipLocation?: string
}
