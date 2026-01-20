import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class SessionDto {
  @IsString()
  @ApiProperty()
  key!: string

  @IsString()
  @ApiProperty()
  scheme!: string

  @IsString()
  @ApiProperty()
  subjectId!: string

  @IsString()
  @ApiPropertyOptional()
  sessionId?: string

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  created!: Date

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  renewed!: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional()
  expires?: Date

  @IsString()
  @ApiProperty()
  ticket!: string

  @IsString()
  @ApiProperty()
  actorSubjectId!: string
}
