import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemTranslationInput')
export class GetTranslationInput {
  @Field(() => String, { nullable: true })
  textToTranslate?: string
}
