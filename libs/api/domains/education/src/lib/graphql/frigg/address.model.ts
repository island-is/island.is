import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AddressModel {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  municipality?: string

  @Field({ nullable: true })
  postCode?: string

  @Field({ nullable: true })
  country?: string
}
