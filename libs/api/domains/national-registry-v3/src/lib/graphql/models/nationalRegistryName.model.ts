import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Name')
export class Name {
  @Field(() => String, { nullable: true })
  givenName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null
}
