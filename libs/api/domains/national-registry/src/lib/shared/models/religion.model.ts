import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryReligion')
export class Religion {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
