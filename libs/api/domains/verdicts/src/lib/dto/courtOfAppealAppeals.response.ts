import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('WebCourtOfAppealAppealsItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => String, { nullable: true })
  appealDate?: string | null

  @Field(() => String, { nullable: true })
  verdictDate?: string | null
}

@ObjectType('WebCourtOfAppealAppealsResponse')
export class CourtOfAppealAppealsResponse {
  @CacheField(() => [Item])
  items!: Item[]

  @Field(() => Int)
  total!: number
}
