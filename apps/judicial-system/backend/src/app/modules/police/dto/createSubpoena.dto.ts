import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { Defendant } from '../../defendant/models/defendant.model'

export class CreateSubpoenaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly documentName!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  readonly ssn!: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly courtRegistrationDate?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly prosecutorSsn?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly prosecutedSsn?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly courtAddress?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly courtRoomNumber?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly defendantSsn?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly courtCeremony?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly lokeCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  readonly courtCaseNumber?: string
}
