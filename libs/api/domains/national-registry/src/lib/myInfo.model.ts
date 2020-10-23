import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MyInfo {
  @Field(() => String)
  fullName!: string

  @Field(() => String, { nullable: true })
  gender!: string | null

  @Field(() => String, { nullable: true })
  legalResidence!: string | null

  @Field(() => String, { nullable: true })
  birthPlace!: string | null

  @Field(() => String, { nullable: true })
  citizenship!: string | null

  @Field(() => String, { nullable: true })
  religion!: string | null

  @Field(() => String, { nullable: true })
  maritalStatus!: string | null

  @Field(() => String, { nullable: true })
  banMarking!: string | null
}
