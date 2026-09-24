import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

/** What an actor has chosen about one party they can act for. */
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
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  readonly isFavourite!: boolean
}
