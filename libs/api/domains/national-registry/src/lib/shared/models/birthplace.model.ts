import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryBirthplace')
export class Birthplace {
  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date | null
}
