import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Owner {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field()
  phone?: string

  @Field()
  email?: string
}
