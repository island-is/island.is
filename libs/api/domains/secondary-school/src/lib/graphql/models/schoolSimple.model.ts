import { Field, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolCountryArea } from './countryArea.model'

@ObjectType('SecondarySchoolSimple')
export class SecondarySchoolSimple {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  abbreviation?: string | null

  @Field(() => SecondarySchoolCountryArea, { nullable: true })
  countryArea?: SecondarySchoolCountryArea
}
