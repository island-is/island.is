import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('AccessControl')
export class AccessControlModel {
  @Field((_) => ID)
  nationalId!: string

  @Field()
  name!: string

  // TODO: use the Role enum and create GraphQL Enum for it as well
  @Field()
  role: string

  // TODO: get from samgongustofa
  @Field()
  partnerId: string
}
