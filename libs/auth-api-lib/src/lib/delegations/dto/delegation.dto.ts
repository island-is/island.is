import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { PersonalRepresentativeRightTypeDTO } from '../../personal-representative/dto/personal-representative-right-type.dto'
import {
  DelegationScopeDTO,
  UpdateDelegationScopeDTO,
} from './delegation-scope.dto'
import { DelegationTypeDto } from './delegation-type.dto'

/** @deprecated - use AuthDelegationProvider from @island.is/shared/types instead */
export enum DelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  PersonalRepresentativeRegistry = 'talsmannagrunnur',
  Custom = 'delegationdb',
}

export class DelegationDTO {
  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  id?: string | null

  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  fromName!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsString()
  @ApiPropertyOptional()
  createdByNationalId?: string | null

  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  toName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null

  @ApiProperty({ enum: AuthDelegationType, enumName: 'AuthDelegationType' })
  type!: AuthDelegationType

  @ApiProperty({
    enum: AuthDelegationProvider,
    enumName: 'AuthDelegationProvider',
  })
  provider!: AuthDelegationProvider

  @IsOptional()
  @ApiPropertyOptional({ nullable: true, type: String })
  @IsString()
  referenceId?: string | null

  @IsOptional()
  @ApiPropertyOptional({ type: [DelegationScopeDTO] })
  @IsArray()
  scopes?: DelegationScopeDTO[]

  @IsString()
  @ApiPropertyOptional({ type: String, nullable: true })
  domainName?: string | null

  // This property is only used in delegation index
  rights?: PersonalRepresentativeRightTypeDTO[]

  // This property is only used in delegation index
  prDelegationType?: DelegationTypeDto[]
}

export class PatchDelegationDTO {
  @ApiPropertyOptional({
    description: 'List of scopes to be added or updated for a delegation.',
    type: [UpdateDelegationScopeDTO],
  })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  updateScopes?: UpdateDelegationScopeDTO[]

  @ApiPropertyOptional({
    description: 'List of scopes to be removed from a delegation.',
  })
  @IsOptional()
  @IsArray()
  deleteScopes?: string[]
}

export class CreateDelegationDTO {
  @IsString()
  @ApiProperty({
    description: 'National ID of the user receiving the delegation.',
  })
  toNationalId!: string

  @ApiPropertyOptional({
    description: 'Name identifying the domain the delegation is given in.',
  })
  @IsOptional()
  domainName?: string

  @ApiPropertyOptional({
    description: 'List of scopes the delegation authorizes.',
    type: [UpdateDelegationScopeDTO],
  })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  scopes?: UpdateDelegationScopeDTO[]
}
