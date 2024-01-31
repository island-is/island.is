import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceCaseFile {
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
