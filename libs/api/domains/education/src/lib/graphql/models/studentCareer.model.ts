import { Field, ObjectType } from '@nestjs/graphql'
import { CompulsorySchoolGradeLevelExamResults } from './gradeLevelExamResults.model'

@ObjectType('EducationCompulsorySchoolStudentCareer')
export class StudentCareer {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  isChildOfUser?: boolean

  @Field({ nullable: true })
  examDateSpan?: string

  @Field(() => [CompulsorySchoolGradeLevelExamResults], { nullable: true })
  examResults?: Array<CompulsorySchoolGradeLevelExamResults>
}
