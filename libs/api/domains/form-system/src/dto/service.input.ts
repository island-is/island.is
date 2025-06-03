import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemTranslationInput')
export class GetTranslationInput {
  @Field(() => String, { nullable: true })
  textToTranslate?: string
}

@InputType('FormSystemGoogleTranslationInput')
export class GetGoogleTranslationInput {
  @Field(() => String, { nullable: false })
  key!: string

  @Field(() => String, { nullable: false })
  q!: string

  @Field(() => String, { nullable: false })
  source!: string

  @Field(() => String, { nullable: false })
  target!: string
}
