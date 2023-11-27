import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryName')
export class Name {
  @Field(() => String, { nullable: true })
  firstName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null

  @Field(() => String, { nullable: true })
  fullName?: string | null
}
