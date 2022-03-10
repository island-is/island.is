import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

@ObjectType('EducationExamFamilyOverview')
export class ExamFamilyOverview {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => Boolean)
  isChild!: boolean

  @Field(() => String)
  organizationType!: string

  @Field(() => String)
  organizationName!: string

  @Field(() => String)
  yearInterval!: string

  @Field(() => Int)
  familyIndex!: number
}
