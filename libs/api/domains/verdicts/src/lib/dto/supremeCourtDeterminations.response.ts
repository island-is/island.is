import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SupremeCourtDeterminationsInput } from './supremeCourtDeterminations.input'

@ObjectType('WebSupremeCourtDeterminationsItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  subtitle!: string

  @Field(() => Date)
  date!: Date

  @CacheField(() => [String])
  keywords!: string[]
}

@ObjectType('WebSupremeCourtDeterminationsResponse')
export class SupremeCourtDeterminationsResponse {
  @CacheField(() => [Item])
  items!: Item[]

  @Field(() => Int)
  total!: number

  @CacheField(() => SupremeCourtDeterminationsInput)
  input!: SupremeCourtDeterminationsInput
}
