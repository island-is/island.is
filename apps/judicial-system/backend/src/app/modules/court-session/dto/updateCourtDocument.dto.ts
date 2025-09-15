import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCourtDocumentDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: Number })
  readonly documentOrder?: number

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly name?: string
}
