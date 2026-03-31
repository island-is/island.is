import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class FileResponseDto {
  @ApiProperty()
  id!: string

  @ApiPropertyOptional()
  filename!: string

  @ApiPropertyOptional()
  mimetype!: string

  @ApiPropertyOptional()
  size!: number

  @ApiProperty()
  file!: string
}
