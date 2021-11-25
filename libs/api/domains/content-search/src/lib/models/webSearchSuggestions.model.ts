import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WebSearchSuggestions {
  @Field(() => String)
  suggestion: string = ''
}
