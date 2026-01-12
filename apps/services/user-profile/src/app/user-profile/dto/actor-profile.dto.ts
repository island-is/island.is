import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { PageInfoDto } from '@island.is/nest/pagination'
import { Locale } from '../types/localeTypes'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class MeActorProfileDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  emailNotifications!: boolean

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID(4)
  readonly emailsId?: string | null

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  readonly email?: string | null

  @ApiPropertyOptional({ type: Boolean, nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean | null
}

export class ActorProfileDto {
  @ApiProperty()
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string | null

  @ApiProperty()
  @IsBoolean()
  readonly emailVerified!: boolean

  @ApiProperty()
  @IsBoolean()
  readonly documentNotifications!: boolean

  @ApiPropertyOptional({ enum: Locale, type: () => Locale, nullable: true })
  @IsOptional()
  @IsEnum(Locale)
  readonly locale?: Locale | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID(4)
  readonly emailsId?: string
}

export class ActorProfileDetailsDto {
  @ApiProperty({ type: () => String, nullable: true })
  @IsOptional()
  @IsEmail()
  readonly email?: string | null

  @ApiProperty({ enum: DataStatus })
  @IsEnum(DataStatus)
  readonly emailStatus!: DataStatus

  @ApiProperty({ type: () => Boolean, nullable: true })
  @IsBoolean()
  readonly needsNudge!: boolean | null

  @ApiProperty()
  @IsString()
  readonly nationalId!: string

  @ApiProperty()
  @IsBoolean()
  readonly emailNotifications!: boolean

  @ApiProperty()
  @IsBoolean()
  readonly emailVerified!: boolean
}

export class PatchActorProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID(4)
  emailsId?: string
}

export class PaginatedActorProfileDto {
  @ApiProperty({ type: [MeActorProfileDto] })
  data!: MeActorProfileDto[]

  @ApiProperty()
  pageInfo!: PageInfoDto

  @IsNumber()
  @ApiProperty()
  totalCount!: number
}

export class ActorLocale {
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  readonly locale!: Locale
}
