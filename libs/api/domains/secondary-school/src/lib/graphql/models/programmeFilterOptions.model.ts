import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SecondarySchoolLevel } from './level.model'
import { SecondarySchoolSimple } from './schoolSimple.model'
import { SecondarySchoolCountryArea } from './countryArea.model'

export enum SecondarySchoolIsReferenceProgramme {
  YES,
  NO,
}

registerEnumType(SecondarySchoolIsReferenceProgramme, {
  name: 'SecondarySchoolIsReferenceProgramme',
})

@ObjectType('SecondarySchoolProgrammeFilterOptions')
export class SecondarySchoolProgrammeFilterOptions {
  @Field(() => [SecondarySchoolLevel], { nullable: true })
  levels?: SecondarySchoolLevel[] | null

  @Field(() => [SecondarySchoolSimple], { nullable: true })
  schools?: SecondarySchoolSimple[] | null

  @Field(() => [SecondarySchoolCountryArea], { nullable: true })
  countryAreas?: SecondarySchoolCountryArea[] | null

  @Field(() => [SecondarySchoolIsReferenceProgramme], { nullable: true })
  isReferenceProgrammeFilterOption?:
    | SecondarySchoolIsReferenceProgramme[]
    | null
}
