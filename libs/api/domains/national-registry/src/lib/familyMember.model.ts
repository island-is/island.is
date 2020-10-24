import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FamilyMember {
  @Field(() => String)
  fullName!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  gender!: string

  @Field(() => String)
  maritalStatus!: string

  @Field(() => String)
  address!: string
}
