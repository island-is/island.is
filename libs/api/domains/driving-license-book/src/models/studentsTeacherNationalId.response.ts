import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseBookStudentForTeacher {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  totalLessonCount?: number
}
