import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class FamilyMember {
  @Field((type) => String)
  fullName!: string

  @Field((type) => String)
  nationalId!: string

  @Field((type) => String)
  gender!: string

  @Field((type) => String)
  maritalStatus!: string

  @Field((type) => String)
  address!: string
}
