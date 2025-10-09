import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PoliceFileTypeCode } from '@island.is/judicial-system/types'

export class UpdatePoliceDocumentDeliveryDto {
  @IsNotEmpty()
  @IsEnum(PoliceFileTypeCode)
  @ApiProperty({ enum: PoliceFileTypeCode, enumName: 'PoliceFileTypeCode' })
  readonly fileTypeCode!: PoliceFileTypeCode

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  servedBy?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  servedAt?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  comment?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  defenderNationalId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  delivered?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnPaper?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToDefendant?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnIslandis?: boolean // delivered electronically on island.is

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToLawyer?: boolean

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: 'object', required: false })
  deliverySupplements?: Record<string, unknown>
}
