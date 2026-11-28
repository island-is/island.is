import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EstatesAction')
export class Action {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  method?: string
}
