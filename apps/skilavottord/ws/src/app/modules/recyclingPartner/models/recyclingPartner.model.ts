import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class RecyclingPartner {
  constructor(
    id: number,
    name: string,
    address: string,
    postNumber: number,
    website: string,
    phone: string,
    active: boolean,
  ) {
    this.id = id
    this.name = name
    this.address = address
    this.postNumber = postNumber
    this.website = website
    this.phone = phone
    this.active = active
  }

  @Field((_1) => ID)
  id: number

  @Field()
  name: string

  @Field()
  address: string

  @Field()
  postNumber: number

  @Field({ nullable: true })
  website: string

  @Field({ nullable: true })
  phone: string

  @Field({ nullable: true })
  active: boolean
}
