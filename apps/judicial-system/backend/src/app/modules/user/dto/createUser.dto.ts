import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { UserRole } from '@island.is/judicial-system/types'

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly nationalId!: string

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly title!: string

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly mobileNumber!: string

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly email!: string

  @IsNotEmpty()
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  readonly role!: UserRole

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly institutionId!: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly active!: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly canConfirmIndictment!: boolean
}
