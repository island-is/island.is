import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
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
  Custom = 'Custom',
}

export enum DelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  Custom = 'delegationdb',
}

export class DelegationDTO {
  @ApiPropertyOptional()
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

  @IsString()
  @ApiPropertyOptional()
  toName?: string

  @ApiProperty({ enum: DelegationType, enumName: 'DelegationType' })
  type!: DelegationType

  @ApiProperty({ enum: DelegationProvider, enumName: 'DelegationProvider' })
  provider!: DelegationProvider

  @IsOptional()
  @ApiPropertyOptional({ type: [DelegationScopeDTO] })
  @IsArray()
  scopes?: DelegationScopeDTO[]
}

export class UpdateDelegationDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  fromName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  toName?: string

  @ApiPropertyOptional({ type: [UpdateDelegationScopeDTO] })
  @Type(() => UpdateDelegationScopeDTO)
  @IsArray()
  scopes!: UpdateDelegationScopeDTO[]
}

export class CreateDelegationDTO {
  @IsString()
  @ApiProperty()
  fromName!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsString()
  @ApiProperty()
  toName?: string

  @ApiPropertyOptional({ type: [UpdateDelegationScopeDTO] })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  scopes?: UpdateDelegationScopeDTO[]
}
