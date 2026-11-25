import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import {
  TRANSLATION_NAMESPACE_MAX_LENGTH,
  TRANSLATION_MESSAGE_KEY_MAX_LENGTH,
  TRANSLATION_BULK_MAX_ITEMS,
} from '@island.is/application/utils'

export class TranslationItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(TRANSLATION_NAMESPACE_MAX_LENGTH)
  namespace!: string

  @ApiProperty()
  @IsString()
  @MaxLength(TRANSLATION_MESSAGE_KEY_MAX_LENGTH)
  messageKey!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueIs?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  valueEn?: string
}

export class BulkUpdateTranslationsDto {
  @ApiProperty({ type: [TranslationItemDto] })
  @IsArray()
  @ArrayMaxSize(TRANSLATION_BULK_MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => TranslationItemDto)
  translations!: TranslationItemDto[]
}

const TRANSLATION_ACTOR_NAME_MAX_LENGTH = 255

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value

export class PublishActorDto {
  @ApiProperty()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(TRANSLATION_ACTOR_NAME_MAX_LENGTH)
  actorName!: string

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(TRANSLATION_ACTOR_NAME_MAX_LENGTH)
  onBehalfOfName?: string
}
