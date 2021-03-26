import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('EducationExamOverview')
export class ExamOverview {
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
}
