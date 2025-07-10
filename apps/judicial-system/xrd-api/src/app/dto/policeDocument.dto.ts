import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  PoliceFileTypeCode,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

// TODO: this is just a temp idea where we assume we get one document update request dto from the police
// to serve updates for both subpoena and verdict documents

// Note: this is missing subpoena specific props
export class UpdatePoliceDocumentDeliveryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: PoliceFileTypeCode })
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
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  delivered?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnPaper?: boolean

  // TODO: sync with RLS to rename this to a more generic name
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnIslandis?: boolean // delivered electronically on island.is

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToLawyer?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredInLegalPaper?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  comment?: string

  // TODO: sync with RLS on this later
  @IsOptional()
  @IsEnum(VerdictAppealDecision)
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  verdictAppealDecision?: VerdictAppealDecision
}
