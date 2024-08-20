import { ApiProperty } from '@nestjs/swagger'

export class ArchiveResponse {
  @ApiProperty({ type: Boolean })
  caseArchived!: boolean
}
