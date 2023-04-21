import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryV3Birthplace {
  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null

  @Field(() => Date)
  dateOfBirth!: Date
}
