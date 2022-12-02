import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeliveryStation {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null
}
