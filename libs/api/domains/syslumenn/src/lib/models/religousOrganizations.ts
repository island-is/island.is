import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class ReligousOrganization {
  @Field(() => String, { nullable: true })
  director?: string | null

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  homeAddress?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  municipality?: string | null
}

@ObjectType()
export class ReligousOrganizationsResponse {
  @CacheField(() => [ReligousOrganization])
  list!: ReligousOrganization[]
}
