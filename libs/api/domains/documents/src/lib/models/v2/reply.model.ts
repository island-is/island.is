import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentReply')
export class Reply {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null
}
