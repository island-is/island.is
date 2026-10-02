import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'

import { DelegationRequestStatus } from '../types/delegationRequestStatus'
import { UpdateDelegationScopeDTO } from './delegation-scope.dto'

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
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  domainNationalId?: string | null

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  description?: string | null

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ nullable: true, type: Boolean })
  allowsWrite?: boolean | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}

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
  @ArrayMaxSize(100)
  scopes!: RequestDelegationScopeDTO[]
}

export class ApproveDelegationRequestDTO {
  @ApiProperty({
    type: [UpdateDelegationScopeDTO],
    description:
      'Scopes to grant: a subset of the requested scopes that the current user can grant.',
  })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  scopes!: UpdateDelegationScopeDTO[]
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
