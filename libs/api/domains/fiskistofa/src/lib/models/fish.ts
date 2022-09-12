import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class QuotaType {
  @Field()
  id?: number

  @Field()
  name!: string

  @Field()
  from!: string

  @Field()
  to!: string
}
