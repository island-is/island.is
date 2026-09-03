import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  TRANSLATION_NAMESPACE_MAX_LENGTH,
  TRANSLATION_MESSAGE_KEY_MAX_LENGTH,
  TRANSLATION_BULK_MAX_ITEMS,
} from '@island.is/application/utils'

export class UpdateTranslationDto {
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

export class PublishTranslationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string
}
