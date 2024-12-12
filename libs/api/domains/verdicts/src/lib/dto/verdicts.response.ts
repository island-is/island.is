import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { VerdictsInput } from './verdicts.input'

@ObjectType('WebVerdictsItem')
class VerdictItem {
  @Field(() => String)
  title!: string

  // TODO: Add more fields
}

@ObjectType('WebVerdictsResponse')
export class VerdictsResponse {
  @CacheField(() => VerdictItem)
  items!: VerdictItem[]

  @CacheField(() => VerdictsInput)
  input!: VerdictsInput

  // TODO: Add total?
}
