import { Field, ObjectType } from '@nestjs/graphql'
import { Base } from './base.model'

@ObjectType('DocumentsV2Sender')
export class Sender {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string
}
