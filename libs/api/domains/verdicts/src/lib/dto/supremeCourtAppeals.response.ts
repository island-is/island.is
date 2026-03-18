import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SupremeCourtAppealsInput } from './supremeCourtAppeals.input'

@ObjectType('WebSupremeCourtAppealsItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  caseNumber!: string

  @CacheField(() => [String])
  keywords!: string[]
}

@ObjectType('WebSupremeCourtAppealsResponse')
export class SupremeCourtAppealsResponse {
  @CacheField(() => [Item])
  items!: Item[]

  @Field(() => Int)
  total!: number

  @CacheField(() => SupremeCourtAppealsInput)
  input!: SupremeCourtAppealsInput
}
