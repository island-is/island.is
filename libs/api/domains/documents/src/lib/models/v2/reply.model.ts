import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentReply')
export class Reply {
  @Field({ nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  email?: string | null
}
