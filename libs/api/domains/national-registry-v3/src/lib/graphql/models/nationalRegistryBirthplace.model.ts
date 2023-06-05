import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Birthplace')
export class Birthplace {
  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date
}
