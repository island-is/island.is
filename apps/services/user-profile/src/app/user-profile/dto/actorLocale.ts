import { IsString, IsEnum } from 'class-validator'
import { Locale } from '../types/localeTypes'
import { ApiProperty } from '@nestjs/swagger'

export class ActorLocale {
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  readonly locale!: Locale
}
