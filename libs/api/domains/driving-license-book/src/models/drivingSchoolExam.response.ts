import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchoolExam {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  examDate?: string

  @Field({ nullable: true })
  schoolSsn?: string

  @Field({ nullable: true })
  schoolName?: string

  @Field({ nullable: true })
  schoolEmployeeSsn?: string

  @Field({ nullable: true })
  schoolEmployeeName?: string

  @Field({ nullable: true })
  schoolTypeId?: number

  @Field({ nullable: true })
  schoolTypeName?: string

  @Field({ nullable: true })
  schoolTypeCode?: string

  @Field({ nullable: true })
  comments?: string
}
