import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryUser {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String, { nullable: true })
  gender?: string

  @Field(() => String, { nullable: true })
  legalResidence?: string

  @Field(() => String, { nullable: true })
  birthPlace?: string

  @Field(() => String, { nullable: true })
  citizenship?: string

  @Field(() => String, { nullable: true })
  religion?: string

  @Field(() => String, { nullable: true })
  maritalStatus?: string

  @Field(() => String, { nullable: true })
  banMarking?: string
}
