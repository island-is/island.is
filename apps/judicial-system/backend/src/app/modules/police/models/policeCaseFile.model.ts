import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseFileCategory } from '@island.is/judicial-system/types'

export class PoliceCaseFile {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @ApiPropertyOptional({ type: Number })
  chapter?: number

  // TODO: Make this a Date and transform data coming from LÖKE
  @ApiPropertyOptional({ type: String })
  displayDate?: string

  @ApiPropertyOptional({ enum: CaseFileCategory })
  category?: CaseFileCategory
}
