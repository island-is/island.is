import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator'

export class DelegationDTO {
  @IsString()
  @ApiProperty()
  fromDisplayName!: string
  @IsBoolean()
  @ApiProperty()
  isFromCompany!: boolean
  @IsString()
  @ApiProperty()
  toNationalId!: string
  @IsDateString()
  @ApiProperty()
  validFrom!: Date
  @IsDateString()
  @ApiProperty()
  validTo?: Date

  @IsOptional()
  @IsArray()
  scopes?: string[]
}
