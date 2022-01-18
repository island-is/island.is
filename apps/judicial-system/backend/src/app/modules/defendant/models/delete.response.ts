import { ApiProperty } from '@nestjs/swagger'

import type { DeleteDefendantResponse as TDeleteDefendantResponse } from '@island.is/judicial-system/types'

export class DeleteDefendantResponse implements TDeleteDefendantResponse {
  @ApiProperty()
  deleted!: boolean
}
