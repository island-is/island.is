import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AdgerdirTag {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  title?: string
}
