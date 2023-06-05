import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Citizenship')
export class Citizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
