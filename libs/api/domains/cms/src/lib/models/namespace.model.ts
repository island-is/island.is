import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Namespace {
  @Field({ nullable: true })
  namespace?: string

  @Field({ nullable: true })
  fields?: string
}
