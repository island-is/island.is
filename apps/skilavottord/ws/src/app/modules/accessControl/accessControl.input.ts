import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  // TODO: use the Role enum and create GraphQL Enum for it as well
  @Field()
  role!: string

  // TODO: get from samgongustofa
  @Field()
  partnerId!: string
}

@InputType()
export class UpdateAccessControlInput {
  @Field()
  name!: string

  // TODO: use the Role enum and create GraphQL Enum for it as well
  @Field()
  role!: string

  // TODO: get from samgongustofa
  @Field()
  partnerId!: string
}
