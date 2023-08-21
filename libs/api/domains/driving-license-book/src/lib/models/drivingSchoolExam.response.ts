import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchoolExam {
  @Field(() => ID)
  id!: string

  @Field()
  examDate!: string

  @Field()
  schoolNationalId!: string

  @Field()
  schoolName!: string

  @Field()
  schoolEmployeeNationalId!: string

  @Field()
  schoolEmployeeName!: string

  @Field()
  schoolTypeId!: number

  @Field()
  schoolTypeName!: string

  @Field()
  schoolTypeCode!: string

  @Field()
  comments!: string

  @Field()
  status!: number

  @Field()
  statusName!: string
}
