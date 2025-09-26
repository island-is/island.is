import { IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class FileCourtDocumentInCourtSessionDto {
  @IsUUID()
  @ApiProperty({ type: String })
  readonly courtSessionId!: string
}
