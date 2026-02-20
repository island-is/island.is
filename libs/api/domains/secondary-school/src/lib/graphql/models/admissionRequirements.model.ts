import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolElementarySubjectRequirement')
export class SecondarySchoolElementarySubjectRequirement {
  @Field(() => String, { nullable: true })
  subject?: string | null

  @Field(() => String, { nullable: true })
  grade?: string | null
}

@ObjectType('SecondarySchoolAdmissionRequirements')
export class SecondarySchoolAdmissionRequirements {
  @Field(() => Int, { nullable: true })
  minimumAge?: number | null

  @Field(() => [SecondarySchoolElementarySubjectRequirement], {
    nullable: true,
  })
  elementarySubjects?: SecondarySchoolElementarySubjectRequirement[] | null

  @Field(() => String, { nullable: true })
  priorEducation?: string | null

  @Field(() => Boolean, { nullable: true })
  definedInCurriculum?: boolean | null

  @Field(() => String, { nullable: true })
  freeText?: string | null
}
