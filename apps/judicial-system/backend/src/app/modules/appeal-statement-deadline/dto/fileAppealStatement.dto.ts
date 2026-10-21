import { IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

// The party a statement request is about: a defendant, a civil claimant, or
// the prosecution when neither is named. On its own it files the party's
// statement; with a date it sets the party's deadline.
export class FileAppealStatementDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string
}
