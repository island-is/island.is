import { ApiProperty } from '@nestjs/swagger'

export class DeleteCourtDocumentResponse {
  @ApiProperty({ type: Boolean })
  deleted!: boolean
}
