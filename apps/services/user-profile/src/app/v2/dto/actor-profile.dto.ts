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
import { Locale } from '../../user-profile/types/localeTypes'

export class MeActorProfileDto {
  @ApiProperty()
  @IsString()
  readonly fromNationalId!: string

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID(4)
  readonly emailsId?: string
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

export class PatchActorProfileDto {
  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean

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
