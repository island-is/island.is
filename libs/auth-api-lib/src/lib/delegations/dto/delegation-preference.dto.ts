import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

import { IsNationalId } from '@island.is/nest/core'

export class DelegationPreferenceDto {
  @ApiProperty()
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  readonly isFavourite!: boolean

  @ApiProperty({ type: Date, nullable: true })
  @IsOptional()
  @IsDate()
  readonly lastUsedAt?: Date | null
}

export class SetDelegationFavouriteDto {
  @ApiProperty()
  @IsNationalId()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  readonly isFavourite!: boolean
}

export class RecordDelegationUsageDto {
  @ApiProperty()
  @IsNationalId()
  readonly fromNationalId!: string
}
