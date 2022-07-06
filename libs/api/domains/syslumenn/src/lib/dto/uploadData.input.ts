import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class Person {
  @Field()
  name!: string

  @Field()
  ssn!: string

  @Field()
  phoneNumber?: string

  @Field()
  email?: string

  @Field()
  homeAddress!: string

  @Field()
  postalCode!: string

  @Field()
  city!: string

  @Field()
  signed!: boolean

  @Field()
  type!: number
}

@InputType()
export class Attachment {
  @Field()
  name!: string

  @Field()
  content!: string
}
