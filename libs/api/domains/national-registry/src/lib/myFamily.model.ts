import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class MyFamily {
  @Field((type) => String)
  fullName!: string
}
