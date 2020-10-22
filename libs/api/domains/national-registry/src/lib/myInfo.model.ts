import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MyInfo {
  @Field(() => String)
  fullName!: string

  @Field(() => String)
  gender!: string

  @Field(() => String)
  legalResidence!: string

  @Field(() => String)
  birthPlace!: string

  @Field(() => String)
  citizenship!: string

  @Field(() => String)
  religion!: string

  @Field(() => String)
  maritalStatus!: string

  @Field(() => String)
  banMarking!: string
}
