import { EinstaklingurDTOFaeding } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryBirthplace {
  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date | null
}
