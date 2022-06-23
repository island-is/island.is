import { ApiProperty } from '@nestjs/swagger'

export class ArchiveResponse {
  @ApiProperty()
  caseArchived!: boolean
}
