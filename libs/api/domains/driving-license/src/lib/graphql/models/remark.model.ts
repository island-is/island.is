import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Remark {
  @Field()
  code!: string

  @Field()
  description!: string
}
