import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

export class UpdateStaffDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly active: boolean

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nickname: string

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly roles: StaffRole[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly email: string
}
