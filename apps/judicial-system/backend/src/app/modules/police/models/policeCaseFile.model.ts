import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { PoliceCaseFile as TPoliceCaseFile } from '@island.is/judicial-system/types'

export class PoliceCaseFile implements TPoliceCaseFile {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  policeCaseNumber!: string

  @ApiPropertyOptional()
  chapter?: number

  @ApiPropertyOptional()
  displayDate?: string
}
