import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { UserRole } from '@island.is/judicial-system/types'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobileNumber!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly role!: UserRole

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly institutionId!: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly active!: boolean
}
