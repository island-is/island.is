import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCourtDocumentDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string
}
