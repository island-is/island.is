import { IsDateString, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

export class DelegationRecordDTO {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string
}

export class DelegationRecordInputDTO {
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

export class CreateDelegationRecordInputDTO {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}
