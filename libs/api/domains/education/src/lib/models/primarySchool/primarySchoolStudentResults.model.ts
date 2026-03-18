import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolAssignmentResult } from './primarySchoolAssignmentResult.model'

@ObjectType('EducationPrimarySchoolStudentResults')
export class PrimarySchoolStudentResults {
  @Field({ nullable: true })
  schoolYear?: string

  @Field(() => Int)
  gradeLevel!: number

  @Field(() => [PrimarySchoolAssignmentResult], { nullable: true })
  assignmentResults?: PrimarySchoolAssignmentResult[]
}
