import { Field, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolStudyTrack } from './studyTrack.model'
import { SecondarySchoolLevel } from './level.model'
import { SecondarySchoolSimple } from './schoolSimple.model'
import { SecondarySchoolCountryArea } from './countryArea.model'

@ObjectType('SecondarySchoolProgrammeFilterOptions')
export class SecondarySchoolProgrammeFilterOptions {
  @Field(() => [SecondarySchoolStudyTrack], { nullable: true })
  studyTracks?: SecondarySchoolStudyTrack[] | null

  @Field(() => [SecondarySchoolLevel], { nullable: true })
  levels?: SecondarySchoolLevel[] | null

  @Field(() => [SecondarySchoolSimple], { nullable: true })
  schools?: SecondarySchoolSimple[] | null

  @Field(() => [SecondarySchoolCountryArea], { nullable: true })
  countryAreas?: SecondarySchoolCountryArea[] | null
}
