import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCourtDocumentDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ type: Number })
  readonly documentOrder?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly name?: string
}
