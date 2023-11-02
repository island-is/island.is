import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CustomDelegationOnlyForDelegationType } from '../../types'

export class ApiScopeBaseDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly enabled!: boolean

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_name',
  })
  readonly name!: string

  @IsString()
  @ApiProperty({
    example: '@island.is',
  })
  readonly domainName!: string

  @IsInt()
  @Min(0)
  @Max(999)
  @IsOptional()
  @ApiProperty({
    example: 0,
    default: 0,
  })
  readonly order?: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly groupId?: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  readonly showInDiscoveryDocument!: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly required!: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly emphasize!: boolean

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly grantToAuthenticatedUser!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly grantToLegalGuardians!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly grantToProcuringHolders!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly grantToPersonalRepresentatives!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly allowExplicitDelegationGrant!: boolean

  @ApiPropertyOptional({
    description: `Array of delegation types that are allowed to use custom delegations.
      Default: undefined - meaning all delegation types are allowed to use custom delegations.
      If set then only the delegation types in the array are allowed to use custom delegations,
      which disables normal authenticated users.`,
    enum: CustomDelegationOnlyForDelegationType,
    enumName: 'CustomDelegationOnlyForDelegationType',
    isArray: true,
    example: [
      CustomDelegationOnlyForDelegationType.ProcurationHolder,
      CustomDelegationOnlyForDelegationType.Custom,
    ],
    default: undefined,
  })
  customDelegationOnlyFor?: CustomDelegationOnlyForDelegationType[]

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly automaticDelegationGrant!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly alsoForDelegatedUser!: boolean

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly isAccessControlled?: boolean
}
