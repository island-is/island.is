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
  @ApiPropertyOptional({ nullable: true })
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
  @ApiPropertyOptional({ nullable: true })
  toName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true })
  validTo?: Date | null

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
  @IsOptional()
  @IsArray()
  scopes?: UpdateDelegationScopeDTO[]
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
