import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemTranslationInput')
export class GetTranslationInput {
  @Field(() => String, { nullable: true })
  textToTranslate?: string
}

@InputType('FormSystemGoogleTranslationInput')
export class GetGoogleTranslationInput {
  @Field(() => String, { nullable: false })
  q!: string
}
