import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class FileResponseDto {
  @ApiProperty()
  id!: string

  @ApiPropertyOptional()
  filename!: string

  @ApiPropertyOptional()
  fileType!: string

  @ApiPropertyOptional()
  size!: number

  @ApiProperty()
  file!: string
}
