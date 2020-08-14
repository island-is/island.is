import { IsString, Length, IsArray, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserProfileDto {
  @IsString()
  @ApiProperty()
  readonly email: string

  @IsBoolean()
  @ApiProperty()
  readonly emailVerified: boolean

  @IsString()
  @ApiProperty()
  readonly zoneInfo: string

  @IsString()
  @ApiProperty()
  readonly locale: string

  @IsString()
  @ApiProperty()
  readonly phoneNumber: string

  @IsBoolean()
  @ApiProperty()
  readonly phoneNumberVerified: boolean

  @IsString()
  @ApiProperty()
  readonly bankAccount: string
  
  @IsArray()
  @ApiProperty()
  readonly notifications: string[]
  
  @IsArray()
  @ApiProperty()
  readonly identityProviders: string[]
}
