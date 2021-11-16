import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WebSearchAutocompleteSuggestions {
  @Field(() => [String])
  completions: string[]
}
