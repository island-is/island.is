import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceCaseFile {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @ApiPropertyOptional({ type: Number })
  chapter?: number

  @ApiPropertyOptional({ type: String })
  displayDate?: string
}
