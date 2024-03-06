import { IsDateString, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

export class DelegationIndexItemDTO {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @ApiProperty({ enum: AuthDelegationType, enumName: 'AuthDelegationType' })
  type!: AuthDelegationType

  @ApiProperty({
    enum: AuthDelegationProvider,
    enumName: 'AuthDelegationProvider',
  })
  provider!: AuthDelegationProvider

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}

export class CreateDelegationIndexItemDTO {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}
