import { Field, ID, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class PracticalDrivingLesson {
  @Field(() => ID)
  bookId!: string

  @Field(() => ID)
  id!: string

  @Field()
  studentNationalId!: string

  @Field()
  studentName!: string

  @Field()
  licenseCategory!: string

  @Field()
  teacherNationalId!: string

  @Field()
  teacherName!: string

  @Field()
  minutes!: number

  @Field()
  createdOn!: string

  @Field()
  comments!: string
}
