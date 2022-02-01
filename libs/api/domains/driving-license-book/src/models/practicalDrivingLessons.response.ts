import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class PracticalDrivingLesson {
  @Field({ nullable: true })
  bookId?: string | null

  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  studentSsn?: string | null

  @Field({ nullable: true })
  studentName?: string | null

  @Field({ nullable: true })
  licenseCategory?: string | null

  @Field({ nullable: true })
  teacherSsn?: string | null

  @Field({ nullable: true })
  teacherName?: string | null

  @Field({ nullable: true })
  minutes?: number

  @Field({ nullable: true })
  createdOn?: string | null

  @Field({ nullable: true })
  comments?: string | null
}

@ObjectType()
export class PracticalDrivingLessonsResponse {
  @Field(() => [PracticalDrivingLesson], { nullable: true })
  data?: PracticalDrivingLesson[] | null
}
