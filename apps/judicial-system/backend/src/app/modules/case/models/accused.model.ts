import { ApiProperty } from '@nestjs/swagger'

import {
  Accused as TAccused,
  CaseGender,
} from '@island.is/judicial-system/types'

export class Accused implements TAccused {
  @ApiProperty()
  nationalId!: string

  @ApiProperty()
  name?: string

  @ApiProperty()
  address?: string

  @ApiProperty({ enum: CaseGender })
  gender: CaseGender
}
