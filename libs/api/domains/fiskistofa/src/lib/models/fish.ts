import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Fish {
  @Field()
  id?: number

  @Field()
  name!: string
}
