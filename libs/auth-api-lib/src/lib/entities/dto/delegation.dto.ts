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

  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date | null | undefined

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
  @ApiPropertyOptional({ type: [UpdateDelegationScopeDTO] })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsArray()
  scopes!: UpdateDelegationScopeDTO[]
}

export class CreateDelegationDTO {
  @IsString()
  @ApiProperty()
  toNationalId!: string

  @ApiPropertyOptional({ type: [UpdateDelegationScopeDTO] })
  @Type(() => UpdateDelegationScopeDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  scopes?: UpdateDelegationScopeDTO[]
}
