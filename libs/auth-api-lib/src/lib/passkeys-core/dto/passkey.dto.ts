import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class PasskeyDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'provider_name',
  })
  passkey_id!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description about the provider',
  })
  public_key!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'authUser.sub',
  })
  user_sub!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'IslandApp',
  })
  type!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'IslandApp',
  })
  idp!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jon Jonsson',
  })
  name!: string

  @IsString()
  @ApiProperty({
    example: 'IslandApp',
  })
  audkenni_sim_number?: string
}
