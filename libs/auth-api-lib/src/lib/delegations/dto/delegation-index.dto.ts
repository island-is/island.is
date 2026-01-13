import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

import { PageInfoDto } from '@island.is/nest/pagination'
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

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, nullable: true })
  subjectId?: string | null

  @IsString()
  @ApiProperty({ type: String })
  type!: AuthDelegationType

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], nullable: true })
  customDelegationScopes?: string[] | null
}

export class PaginatedDelegationRecordDTO {
  @ApiProperty({ type: [DelegationRecordDTO] })
  data!: DelegationRecordDTO[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @IsNumber()
  @ApiProperty()
  totalCount!: number
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
