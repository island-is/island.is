import { IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CourtSessionDocumentType } from '@island.is/judicial-system/types'

export class CreateCourtSessionDocumentDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly documentType!: CourtSessionDocumentType

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
