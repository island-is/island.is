import { ApiProperty } from '@nestjs/swagger'

import { Groups } from './componentDefinitions/groups.model'

export class PoliceDocumentSupplements {
  @ApiProperty({ type: () => [Groups] })
  groups!: Groups[]
}
