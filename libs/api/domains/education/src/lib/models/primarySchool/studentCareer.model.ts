import { Field, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolGradeLevelExamResults } from './gradeLevelExamResults.model'

@ObjectType('EducationPrimarySchoolStudentCareer')
export class StudentCareer {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  isChildOfUser?: boolean

  @Field({ nullable: true })
  examDateSpan?: string

  @Field(() => [PrimarySchoolGradeLevelExamResults], { nullable: true })
  examResults?: Array<PrimarySchoolGradeLevelExamResults>
}
