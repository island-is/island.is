import { Field, ID, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class PracticalDrivingLesson {
  @Field(()=> ID, { nullable: true })
  bookId?: string

  @Field(()=> ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  studentSsn?: string

  @Field({ nullable: true })
  studentName?: string

  @Field({ nullable: true })
  licenseCategory?: string

  @Field({ nullable: true })
  teacherSsn?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  minutes?: number

  @Field({ nullable: true })
  createdOn?: string

  @Field({ nullable: true })
  comments?: string
}
