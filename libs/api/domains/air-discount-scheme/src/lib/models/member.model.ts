import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AirDiscountSchemeMember')
export class Member {
  @Field()
  name!: string

  nationalId!: string
}
