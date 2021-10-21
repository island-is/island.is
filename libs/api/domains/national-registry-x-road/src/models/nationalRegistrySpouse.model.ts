import { Field, ObjectType, ID } from '@nestjs/graphql'
@ObjectType()
export class NationalRegistrySpouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  maritalStatus?: string

  @Field(() => String, { nullable: true })
  name?: string
}
