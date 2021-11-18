import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name!: string

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  readonly roles!: StaffRole[]
}
