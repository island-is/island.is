import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictKeyword')
class Keyword {
  @Field()
  label!: string

  @Field(() => Boolean)
  belongsToSupremeCourt!: boolean

  @Field(() => Boolean)
  belongsToOtherCourts!: boolean
}

@ObjectType('WebVerdictKeywordsResponse')
export class KeywordsResponse {
  @CacheField(() => [Keyword])
  keywords!: Keyword[]
}
