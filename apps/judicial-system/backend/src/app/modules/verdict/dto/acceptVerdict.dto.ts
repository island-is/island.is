import { IsIn } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { VerdictAppealDecision } from '@island.is/judicial-system/types'

// A defender registers one position on the defendant's behalf: that the
// verdict is accepted. Postponing is the state the verdict is already in, and
// an appeal is filed as an appeal case.
export class AcceptVerdictDto {
  @IsIn([VerdictAppealDecision.ACCEPT])
  @ApiProperty({ enum: [VerdictAppealDecision.ACCEPT] })
  readonly appealDecision!: VerdictAppealDecision.ACCEPT
}
