import { IsString, MaxLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCourtDocumentDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly name!: string
}
