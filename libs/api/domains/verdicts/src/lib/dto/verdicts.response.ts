import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { VerdictsInput } from './verdicts.input'

@ObjectType('WebVerdictJudge')
class VerdictJudge {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  title?: string | null
}

@ObjectType('WebVerdictItem')
class VerdictItem {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  court!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => Date)
  verdictDate!: Date

  @CacheField(() => VerdictJudge, { nullable: true })
  presidentJudge?: VerdictJudge | null

  @CacheField(() => [String])
  keywords!: string[]

  @Field(() => String)
  presentings!: string

  // TODO: Add more fields
}

@ObjectType('WebVerdictsResponse')
export class VerdictsResponse {
  @CacheField(() => [VerdictItem])
  items!: VerdictItem[]

  @CacheField(() => VerdictsInput)
  input!: VerdictsInput

  // TODO: Add total?
}

@ObjectType('WebVerdictByIdItem')
class VerdictByIdItem {
  @Field(() => String, { nullable: true })
  title?: string
}

@ObjectType('WebVerdictByIdResponse')
export class VerdictByIdResponse {
  @CacheField(() => VerdictByIdItem)
  item!: VerdictByIdItem
}
