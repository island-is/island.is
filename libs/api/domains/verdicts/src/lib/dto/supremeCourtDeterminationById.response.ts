import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('WebSupremeCourtDeterminationByIdItem')
class Item {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  subtitle!: string
}

@ObjectType('WebSupremeCourtDeterminationByIdResponse')
export class SupremeCourtDeterminationByIdResponse {
  @CacheField(() => Item)
  item!: Item
}
