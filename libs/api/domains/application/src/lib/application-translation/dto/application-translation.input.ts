import { Field, InputType } from '@nestjs/graphql'
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
  GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT,
  GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST,
  MaxTotalChars,
} from '../google-translate.limits'

/** Must match application_translation.namespace STRING(255). */
const TRANSLATION_NAMESPACE_MAX_LENGTH = 255
/** Must match application_translation.message_key STRING(512). */
const TRANSLATION_MESSAGE_KEY_MAX_LENGTH = 512
const TRANSLATION_BULK_MAX_ITEMS = 500

@InputType()
export class UpdateApplicationTranslationInput {
  @Field()
  @IsString()
  @MaxLength(TRANSLATION_NAMESPACE_MAX_LENGTH)
  namespace!: string

  @Field()
  @IsString()
  @MaxLength(TRANSLATION_MESSAGE_KEY_MAX_LENGTH)
  messageKey!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  valueIs?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  valueEn?: string
}

@InputType()
export class TranslationItemInput {
  @Field()
  @IsString()
  @MaxLength(TRANSLATION_NAMESPACE_MAX_LENGTH)
  namespace!: string

  @Field()
  @IsString()
  @MaxLength(TRANSLATION_MESSAGE_KEY_MAX_LENGTH)
  messageKey!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  valueIs?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  valueEn?: string
}

@InputType()
export class BulkUpdateApplicationTranslationsInput {
  @Field(() => [TranslationItemInput])
  @IsArray()
  @ArrayMaxSize(TRANSLATION_BULK_MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => TranslationItemInput)
  translations!: TranslationItemInput[]
}

@InputType()
export class PublishTranslationsInput {
  @Field()
  @IsString()
  @MaxLength(TRANSLATION_NAMESPACE_MAX_LENGTH)
  namespace!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  note?: string
}

@InputType()
export class RollbackTranslationsInput {
  @Field()
  @IsString()
  @MaxLength(TRANSLATION_NAMESPACE_MAX_LENGTH)
  namespace!: string

  @Field()
  @IsString()
  publishId!: string
}

@InputType()
export class GoogleTranslateStringsInput {
  @Field(() => [String], {
    description: `Strings to translate from Icelandic to English. At most ${GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST} items and ${GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST} characters in total, each item at most ${GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT} characters.`,
  })
  @IsArray()
  @ArrayMaxSize(GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST)
  @IsString({ each: true })
  @MaxLength(GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT, { each: true })
  @MaxTotalChars(GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST)
  texts!: string[]
}
