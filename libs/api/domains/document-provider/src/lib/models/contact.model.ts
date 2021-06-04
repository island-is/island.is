import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Contact {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date
}
