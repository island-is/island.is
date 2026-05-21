import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminTranslationLanguage')
export class TranslationLanguage {
  @Field(() => String)
  isoKey!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  englishDescription!: string
}
