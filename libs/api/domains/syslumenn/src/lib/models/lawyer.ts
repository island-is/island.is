import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Lawyer {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  licenceType?: string
}
