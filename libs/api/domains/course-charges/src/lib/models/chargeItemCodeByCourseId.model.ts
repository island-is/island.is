import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ChargeItemCodeByCourseIdItem {
  @Field(() => ID)
  code!: string

  @Field(() => String)
  name!: string
}

@ObjectType()
export class ChargeItemCodeByCourseIdResponse {
  @CacheField(() => [ChargeItemCodeByCourseIdItem])
  items!: ChargeItemCodeByCourseIdItem[]
}
