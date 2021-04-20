import { IsString, IsBoolean, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ApiScopesDTO {
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
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  readonly displayName!: string

  @IsString()
  @ApiProperty({
    example: 'set_description',
  })
  readonly description!: string

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
  readonly allowExplicitDelegationGrant!: boolean

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
  readonly isAccessControlled!: boolean
}
