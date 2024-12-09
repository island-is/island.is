import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemLanguageTypeInput')
export class LanguageTypeInput {
  @Field(() => String, { nullable: true })
  is?: string

  @Field(() => String, { nullable: true })
  en?: string
}
