import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  constructor(nationalId: string, name: string, mobile: string) {
    this.nationalId = nationalId
    this.name = name
    this.mobile = mobile
  }

  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string
}
