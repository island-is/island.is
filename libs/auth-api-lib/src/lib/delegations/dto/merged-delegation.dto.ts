import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'
import { DelegationType } from '../types/delegationType'

export class MergedDelegationDTO {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  fromName!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  toName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null

  @ApiProperty({
    enum: DelegationType,
    enumName: 'DelegationType',
    isArray: true,
  })
  types!: DelegationType[]
}
