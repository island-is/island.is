import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

@ObjectType('EducationExamFamilyOverview')
export class ExamFamilyOverview {
  @Field()
  nationalId!: string

  @Field()
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
