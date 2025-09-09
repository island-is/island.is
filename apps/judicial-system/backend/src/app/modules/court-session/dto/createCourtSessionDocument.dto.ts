import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCourtSessionDocumentDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string
}
