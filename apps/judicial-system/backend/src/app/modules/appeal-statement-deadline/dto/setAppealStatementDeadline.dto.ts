import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// Which party gets the deadline: a defendant, a civil claimant, or the
// prosecution when neither is named.
export class SetAppealStatementDeadlineDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly deadline!: Date
}
