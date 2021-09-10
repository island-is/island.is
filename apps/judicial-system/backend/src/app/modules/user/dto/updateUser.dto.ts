import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import type { UserRole } from '@island.is/judicial-system/types'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly mobileNumber?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly role?: UserRole

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly institutionId?: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly active?: string
}
