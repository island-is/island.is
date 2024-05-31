import { ApiProperty } from '@nestjs/swagger'

import { Defendant, Institution, User } from '@island.is/judicial-system/types'

export class InternalCaseResponse {
  @ApiProperty({ type: String })
  courtCaseNumber!: string

  @ApiProperty({ type: Object })
  defendants!: Defendant[]

  @ApiProperty({ type: Object })
  court!: Institution

  @ApiProperty({ type: Object })
  judge!: User

  @ApiProperty({ type: Object })
  prosecutorsOffice!: Institution

  @ApiProperty({ type: Object })
  prosecutor!: User
}
