import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Religion')
export class Religion {
  @Field(() => String, { nullable: true })
  name?: string | null
}
