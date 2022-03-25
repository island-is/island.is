import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator'

export enum ScopeType {
  ApiScope = 'apiScope',
  IdentityResource = 'identityResource',
}

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  name!: string

  @IsEnum(ScopeType)
  @ApiProperty({ enum: ScopeType, enumName: 'ScopeType' })
  type!: ScopeType

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description:
      'A date that the delegation is valid to. Must be in the future.',
  })
  validTo!: Date
}

export class DelegationScopeDTO {
  @ApiPropertyOptional({ nullable: true })
  id?: string | null

  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsString()
  @ApiProperty()
  displayName!: string

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true })
  validTo?: Date | null
}
