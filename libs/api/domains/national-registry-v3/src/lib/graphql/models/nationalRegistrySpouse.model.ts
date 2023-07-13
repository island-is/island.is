import { Field, ObjectType, ID } from '@nestjs/graphql'
@ObjectType('NationalRegistryV3Spouse')
export class Spouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  maritalStatus?: string | null

  @Field(() => String, { nullable: true })
  cohabitation?: string | null
}
