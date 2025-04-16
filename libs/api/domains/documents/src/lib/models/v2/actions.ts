import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentV2Action')
export class Action {
  @Field({ nullable: true })
  title?: string | null

  @Field({ nullable: true })
  type?: string | null

  @Field({ nullable: true })
  data?: string | null

  @Field({ nullable: true })
  icon?: string | null
}
