import { ApiProperty } from '@nestjs/swagger'

export class ArchiveResponse {
  @ApiProperty()
  archived!: boolean
}
