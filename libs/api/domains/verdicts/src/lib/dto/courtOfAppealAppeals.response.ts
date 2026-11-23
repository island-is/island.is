import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CourtOfAppealAppealsInput } from './courtOfAppealAppeals.input'

@ObjectType('WebCourtOfAppealAppealsItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  appealDate?: string | null
}

@ObjectType('WebCourtOfAppealAppealsResponse')
export class CourtOfAppealAppealsResponse {
  @CacheField(() => [Item])
  items!: Item[]

  @Field(() => Int)
  total!: number

  @CacheField(() => CourtOfAppealAppealsInput)
  input!: CourtOfAppealAppealsInput
}
