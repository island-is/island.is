import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationFriggAddressModel')
export class AddressModel {
  @Field()
  id!: string

  @Field()
  address!: string

  @Field({ nullable: true })
  municipality?: string

  @Field()
  postCode!: string

  @Field({ nullable: true })
  country?: string
}
