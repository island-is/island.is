import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolStudyTrack } from './studyTrack.model'
import { SecondarySchoolQualification } from './qualification.model'
import { SecondarySchoolSpecialization } from './specialization.model'
import { SecondarySchoolSimple } from './schoolSimple.model'

@ObjectType('SecondarySchoolProgrammeSimple')
export class SecondarySchoolProgrammeSimple {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  ministrySerial?: string | null

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => SecondarySchoolStudyTrack, { nullable: true })
  studyTrack?: SecondarySchoolStudyTrack

  @Field(() => SecondarySchoolQualification, { nullable: true })
  qualification?: SecondarySchoolQualification

  @Field(() => SecondarySchoolSpecialization, { nullable: true })
  specialization?: SecondarySchoolSpecialization

  @Field(() => Int, { nullable: true })
  credits?: number

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => [SecondarySchoolSimple], { nullable: true })
  schools?: SecondarySchoolSimple[] | null
}
