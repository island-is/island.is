import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseBookStudentForTeacher {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field()
  totalLessonCount!: number
}
