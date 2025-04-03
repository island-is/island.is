import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentsV2Sender')
export class Sender {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  name?: string | null
}
