import { IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCourtSessionDocumentDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly documentType!: string

  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly caseFileId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly generatedPdfUri?: string
}