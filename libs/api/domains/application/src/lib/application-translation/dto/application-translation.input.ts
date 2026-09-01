import { Field, InputType } from '@nestjs/graphql'
import { ArrayMaxSize, IsArray, IsString, MaxLength } from 'class-validator'

import {
  GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
  GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT,
  GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST,
  MaxTotalChars,
} from '../google-translate.limits'

@InputType()
export class UpdateApplicationTranslationInput {
  @Field()
  namespace!: string

  @Field()
  messageKey!: string

  @Field(() => String, { nullable: true })
  valueIs?: string

  @Field(() => String, { nullable: true })
  valueEn?: string
}

@InputType()
export class TranslationItemInput {
  @Field()
  namespace!: string

  @Field()
  messageKey!: string

  @Field(() => String, { nullable: true })
  valueIs?: string

  @Field(() => String, { nullable: true })
  valueEn?: string
}

@InputType()
export class BulkUpdateApplicationTranslationsInput {
  @Field(() => [TranslationItemInput])
  translations!: TranslationItemInput[]
}

@InputType()
export class PublishTranslationsInput {
  @Field()
  namespace!: string

  @Field(() => String, { nullable: true })
  note?: string
}

@InputType()
export class RollbackTranslationsInput {
  @Field()
  namespace!: string

  @Field()
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
