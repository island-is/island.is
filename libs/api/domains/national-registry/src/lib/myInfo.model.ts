import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class MyInfo {
  @Field((type) => String)
  fullName!: string

  @Field((type) => String)
  gender!: string

  @Field((type) => String)
  legalResidence!: string

  @Field((type) => String)
  birthPlace!: string

  @Field((type) => String)
  citizenship!: string

  @Field((type) => String)
  religion!: string

  @Field((type) => String)
  maritalStatus!: string

  @Field((type) => String)
  banMarking!: string
}
