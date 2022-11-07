import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator'
import {
  DelegationScopeDTO,
  UpdateDelegationScopeDTO,
} from './delegation-scope.dto'

export enum DelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  PersonalRepresentative = 'PersonalRepresentative',
  Custom = 'Custom',
}

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
  @ApiPropertyOptional({ nullable: true, type: String })
  toName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null

  @ApiProperty({ enum: DelegationType, enumName: 'DelegationType' })
  type!: DelegationType

  @ApiProperty({ enum: DelegationProvider, enumName: 'DelegationProvider' })
  provider!: DelegationProvider

  @IsOptional()
  @ApiPropertyOptional({ type: [DelegationScopeDTO] })
  @IsArray()
  scopes?: DelegationScopeDTO[]

  @IsString()
  @ApiPropertyOptional({ type: String, nullable: true })
  domainName?: string | null
}

export class UpdateDelegationDTO {
  @ApiPropertyOptional({ type: [UpdateDelegationScopeDTO] })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  scopes?: UpdateDelegationScopeDTO[]
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
