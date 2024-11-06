import { Field, InputType } from '@nestjs/graphql'

@InputType('EducationCompulsorySchoolExamUserFamilyMemberResultsInput')
export class ExamFamilyMemberInput {
  @Field()
  maskedId!: string
}
