import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'

export class DelegationDTO {
  @IsString()
  @ApiProperty()
  fromDisplayName!: string
  @IsString()
  @ApiProperty()
  toNationalId!: string
  @IsDateString()
  @ApiProperty()
  validFrom!: Date
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  validTo?: Date

  @IsOptional()
  @ApiProperty()
  @IsArray()
  scopes?: string[]
}
