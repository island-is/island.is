import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingBookLesson } from './drivingBookLesson.response'
import { DrivingSchoolExam } from './drivingSchoolExam.response'
import { DrivingLicenceTestResult } from './drivingLicenseTestResult.response'

@ObjectType()
export class DrivingLicenseBook {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  licenseCategory?: string

  @Field({ nullable: true })
  createdOn?: string

  @Field({ nullable: true })
  teacherNationalId?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  schoolNationalId?: string

  @Field({ nullable: true })
  schoolName?: string

  @Field({ nullable: true })
  isDigital?: boolean

  @Field({ nullable: true })
  totalLessonTime?: number

  @Field({ nullable: true })
  totalLessonCount?: number

  @Field(() => [DrivingBookLesson], { nullable: true })
  teachersAndLessons?: DrivingBookLesson[]

  @Field(() => [DrivingSchoolExam], { nullable: true })
  drivingSchoolExams?: DrivingSchoolExam[]

  @Field(() => [DrivingLicenceTestResult], { nullable: true })
  testResults?: DrivingLicenceTestResult[]
}
