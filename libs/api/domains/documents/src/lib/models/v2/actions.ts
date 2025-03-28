import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentV2Action')
export class Action {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  data?: string

  @Field({ nullable: true })
  icon?: string
}
