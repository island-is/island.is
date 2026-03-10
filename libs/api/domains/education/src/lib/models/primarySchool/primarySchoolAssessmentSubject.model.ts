import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssessmentType } from './primarySchoolAssessmentType.model'

@ObjectType()
export class PrimarySchoolAssessmentSubject {
  @Field(() => ID)
  id!: string

  @Field()
  identifier!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [PrimarySchoolAssessmentType], { nullable: true })
  assessmentTypes?: PrimarySchoolAssessmentType[]
}
