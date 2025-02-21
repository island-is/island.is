import { Field, InputType } from '@nestjs/graphql'

@InputType('EducationPrimarySchoolExamUserFamilyMemberResultsInput')
export class ExamFamilyMemberInput {
  @Field()
  maskedId!: string
}
