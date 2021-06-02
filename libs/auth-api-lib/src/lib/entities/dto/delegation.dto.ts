import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'
import { DelegationScopeDTO } from './delegation-scope.dto'

export enum DelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  Custom = 'Custom',
}

export enum DelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  Custom = 'delegationdb',
}

export class DelegationDTO {
  @ApiProperty()
  id?: string

  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  fromName!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @ApiProperty({ enum: DelegationType, enumName: 'DelegationType' })
  type!: DelegationType

  @ApiProperty({ enum: DelegationProvider, enumName: 'DelegationProvider' })
  provider!: DelegationProvider

  @IsOptional()
  @ApiProperty()
  @IsArray()
  scopes?: DelegationScopeDTO[]
}

export class UpdateDelegationDTO extends OmitType(DelegationDTO, [
  'id',
  'fromNationalId',
  'type',
  'provider',
] as const) {}
