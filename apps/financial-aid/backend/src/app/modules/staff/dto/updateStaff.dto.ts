import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

export class UpdateStaffDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly active!: boolean

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly nickname: string

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  readonly roles: StaffRole[]
}
