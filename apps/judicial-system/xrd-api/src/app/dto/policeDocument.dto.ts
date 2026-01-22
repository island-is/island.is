import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PoliceFileTypeCode } from '@island.is/judicial-system/types'

class Supplement {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  id?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  deliveryId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  code?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  value?: string
}

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
  deliveredOnIslandis?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToLawyer?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  deliveryMethod?: string

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: () => Supplement, isArray: true })
  supplements?: Supplement[]
}
