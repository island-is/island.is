import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FiskistofaQuotaType {
  @Field()
  id?: number

  @Field()
  name!: string

  @Field()
  from!: string

  @Field()
  to!: string
}
