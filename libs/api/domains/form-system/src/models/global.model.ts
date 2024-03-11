import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemLanguageType')
export class LanguageType {
  @Field(() => String, { nullable: true })
  is?: string | null

  @Field(() => String, { nullable: true })
  en?: string | null
}
