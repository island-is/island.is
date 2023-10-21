import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import type { UserRole } from '@island.is/judicial-system/types'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly mobileNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly role?: UserRole

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly institutionId?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly active?: boolean
}
