import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentV2Action')
export class Action {
  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  data?: string | null

  @Field(() => String, { nullable: true })
  icon?: string | null
}
