import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator'

export class DelegationDTO {
  @IsString()
  @ApiProperty()
  fromNationalId!: string
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
  @IsNumber()
  @ApiProperty()
  validCount?: number
}
