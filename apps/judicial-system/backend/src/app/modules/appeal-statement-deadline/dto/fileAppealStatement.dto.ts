import { IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

// Whose statement is being filed: a defendant's, a civil claimant's, or the
// prosecution's when neither is named.
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
