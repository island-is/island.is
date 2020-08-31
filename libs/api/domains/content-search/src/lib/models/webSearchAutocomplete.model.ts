import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WebSearchAutocomplete {
  @Field(() => Int)
  total: number

  @Field(() => [String])
  completions: string[]
}
