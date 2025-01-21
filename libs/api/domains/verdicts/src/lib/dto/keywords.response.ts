import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictKeyword')
class Keyword {
  @Field(() => Int)
  id!: number

  @Field()
  label!: string
}

@ObjectType('WebVerdictKeywordsResponse')
export class KeywordsResponse {
  @CacheField(() => [Keyword])
  keywords!: Keyword[]
}
