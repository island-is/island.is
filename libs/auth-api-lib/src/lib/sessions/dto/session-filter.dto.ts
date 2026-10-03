import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class SessionFilter {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  subjectId?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sessionId?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  actorSubjectId?: string
}
