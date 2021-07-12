import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomerChargeTypeItem {
  @Field()
  id!: string

  @Field()
  name!: string
}
