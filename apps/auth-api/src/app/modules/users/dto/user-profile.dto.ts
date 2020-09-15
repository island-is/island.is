import {
  IsString,
  Length,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'set_email',
  })
  readonly email: string

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly emailVerified: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'set_zone_info',
  })
  readonly zoneInfo: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'set_locale',
  })
  readonly locale: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'set_phone_number',
  })
  readonly phoneNumber: string

  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  readonly phoneNumberVerified: boolean

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'set_bank_account',
  })
  readonly bankAccount: string

  @IsArray()
  @ApiProperty()
  readonly notifications: string[]

  @IsArray()
  @ApiProperty()
  readonly identityProviders: string[]
}
