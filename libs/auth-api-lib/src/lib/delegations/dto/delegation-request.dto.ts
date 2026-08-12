import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'

import { DelegationRequestStatus } from '../types/delegationRequestStatus'

/** A single scope asked for as part of a delegation request. */
export class DelegationRequestScopeDTO {
  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  displayName?: string | null

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  domainName?: string | null

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  domainDisplayName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}

/** Scope reference the requester wants; validTo is optional. */
export class RequestDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}

export class CreateDelegationRequestDTO {
  @IsString()
  @ApiProperty({
    description:
      'National id of the prospective grantor (an individual, or a company whose procuration holders decide).',
  })
  toGranterNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Name identifying the domain the delegation is requested in.',
  })
  domainName?: string

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  @ApiProperty({ description: "The requester's relationship to the grantor." })
  relationship!: string

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  @ApiProperty({ description: 'The reason/purpose for the request.' })
  reason!: string

  @ApiProperty({ type: [RequestDelegationScopeDTO] })
  @Type(() => RequestDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  scopes!: RequestDelegationScopeDTO[]
}

export class FulfillDelegationRequestDTO {
  @IsString()
  @ApiProperty({
    description: 'Id of the delegation created to fulfill this request.',
  })
  delegationId!: string
}

export class DelegationRequestDTO {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  domainName?: string | null

  @IsString()
  @ApiProperty()
  relationship!: string

  @IsString()
  @ApiProperty()
  reason!: string

  @IsEnum(DelegationRequestStatus)
  @ApiProperty({
    enum: DelegationRequestStatus,
    enumName: 'DelegationRequestStatus',
  })
  status!: DelegationRequestStatus

  @IsString()
  @ApiProperty()
  createdByNationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  resolvedByNationalId?: string | null

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  resolvedDelegationId?: string | null

  @IsDateString()
  @ApiProperty({ type: Date })
  expiresAt!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  createdAt?: Date | null

  @ApiPropertyOptional({ type: [DelegationRequestScopeDTO] })
  @IsArray()
  scopes?: DelegationRequestScopeDTO[]
}
