import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('AuthAdminTranslationsInput')
export class TranslationsInput {
  @Field(() => String, { nullable: true })
  searchString?: string

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  count!: number
}
