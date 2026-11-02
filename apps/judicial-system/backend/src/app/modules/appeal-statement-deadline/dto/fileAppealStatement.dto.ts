import { IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

// The party a statement request is about: a defendant, a civil claimant, or
// the prosecution when neither is named. Filing touches no deadline: a
// deadline the court gave earlier stays as it is and locks.
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
