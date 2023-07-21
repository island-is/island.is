import { EinstaklingurDTONafnAllt } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryName {
  @Field(() => String, { nullable: true })
  givenName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null
}
