import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderAction')
export class Action {
  @Field({ nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  data?: string
}
