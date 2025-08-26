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

// Note: This is just a temp idea where we assume we get one document update request dto from the police
// to serve updates for both subpoena (soon) and verdict documents (current)

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
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  comment?: string

  // TODO: How does RLS want to send us delivery status?
  // below is a propisal, but ideally it would be GREAT if this could
  // be managed within a single field :-)
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnPaper?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredOnIslandis?: boolean // delivered electronically on island.is

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  deliveredToLawyer?: boolean

  // Note: we can't know if a verdict is delivered in the legal paper
  // but we can know if it is requested
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, required: false })
  requestedDeliveryInLegalPaper?: boolean

  // TODO: How does RLS want to send us verdict appeal decision?
  @IsOptional()
  @IsEnum(VerdictAppealDecision)
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  verdictAppealDecision?: VerdictAppealDecision
}
