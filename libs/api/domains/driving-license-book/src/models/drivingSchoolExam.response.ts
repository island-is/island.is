import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchoolExam {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  examDate?: string | null

  @Field({ nullable: true })
  schoolSsn?: string | null

  @Field({ nullable: true })
  schoolName?: string | null

  @Field({ nullable: true })
  schoolEmployeeSsn?: string | null

  @Field({ nullable: true })
  schoolEmployeeName?: string | null

  @Field({ nullable: true })
  schoolTypeId?: number

  @Field({ nullable: true })
  schoolTypeName?: string | null

  @Field({ nullable: true })
  schoolTypeCode?: string | null

  @Field({ nullable: true })
  comments?: string | null
}
