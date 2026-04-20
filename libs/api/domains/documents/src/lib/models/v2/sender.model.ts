import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentsV2Sender')
export class Sender {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  logoUrl?: string | null
}
