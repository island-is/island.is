import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

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
