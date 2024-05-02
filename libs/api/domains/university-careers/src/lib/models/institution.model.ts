import {
  UniversityId,
  UniversityIdShort,
} from '@island.is/clients/university-careers'
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersInstitution')
export class Institution {
  @Field(() => UniversityId)
  id!: UniversityId

  @Field(() => String)
  shortId!: UniversityIdShort

  @Field(() => String, { nullable: true })
  displayName?: string

  @Field(() => String, { nullable: true })
  logoUrl?: string
}
