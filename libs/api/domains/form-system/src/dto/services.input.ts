import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetPropertyInput')
export class GetPropertyInput {
  @Field(() => String)
  propertyId!: string
}

@InputType('FormSystemGetTranslationInput')
export class GetTranslationInput {
  @Field(() => [String])
  contents: string[] = []
}
