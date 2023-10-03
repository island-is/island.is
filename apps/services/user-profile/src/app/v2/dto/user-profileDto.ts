import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class UserProfileDto {
  @IsString()
  readonly nationalId: string

  @IsOptional()
  @IsString()
  readonly email?: string

  @IsOptional()
  @IsString()
  readonly mobilePhoneNumber?: string

  @IsOptional()
  @IsString()
  readonly locale?: string

  @IsOptional()
  @IsEnum(DataStatus)
  readonly mobileStatus?: DataStatus

  @IsOptional()
  @IsEnum(DataStatus)
  readonly emailStatus?: DataStatus

  @IsOptional()
  @IsBoolean()
  readonly mobilePhoneNumberVerified?: boolean

  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean
}
