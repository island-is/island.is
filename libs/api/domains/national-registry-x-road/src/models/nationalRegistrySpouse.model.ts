import { Field, ObjectType, ID } from '@nestjs/graphql'
@ObjectType('NationalRegistryXRoadSpouse')
export class NationalRegistrySpouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  maritalStatus?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
