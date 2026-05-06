import { Field, InputType } from '@nestjs/graphql'

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
