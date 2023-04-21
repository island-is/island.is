import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryV3Religion {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
