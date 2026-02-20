import { Field, Int, ObjectType } from '@nestjs/graphql'
import { SecondarySchoolStudyTrack } from './studyTrack.model'
import { SecondarySchoolQualification } from './qualification.model'
import { SecondarySchoolSpecialization } from './specialization.model'
import { SecondarySchoolSimple } from './schoolSimple.model'
import { SecondarySchoolAdmissionRequirements } from './admissionRequirements.model'

@ObjectType('SecondarySchoolProgrammeDetail')
export class SecondarySchoolProgrammeDetail {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  ministrySerial?: string | null

  @Field(() => String, { nullable: true })
  version?: string | null

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

  @Field(() => String, { nullable: true })
  structureDescription?: string | null

  @Field(() => Boolean, { nullable: true })
  allowsFreeChoice?: boolean

  @Field(() => String, { nullable: true })
  freeChoiceDescription?: string | null

  @Field(() => String, { nullable: true })
  academicProgress?: string | null

  @Field(() => Boolean, { nullable: true })
  academicProgressDefinedInCurriculum?: boolean

  @Field(() => String, { nullable: true })
  academicEvaluation?: string | null

  @Field(() => Boolean, { nullable: true })
  academicEvaluationDefinedInCurriculum?: boolean

  @Field(() => [String], { nullable: true })
  competencyCriteria?: string[] | null

  @Field(() => SecondarySchoolAdmissionRequirements, { nullable: true })
  admissionRequirements?: SecondarySchoolAdmissionRequirements

  @Field(() => [SecondarySchoolSimple], { nullable: true })
  schools?: SecondarySchoolSimple[] | null
}
