import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { PageInfoDto } from '@island.is/nest/pagination'
import { Locale } from '../types/localeTypes'

export class MeActorProfileDto {
  @ApiProperty()
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean
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
}

export class PatchActorProfileDto {
  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean
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
