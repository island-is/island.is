import { Field, ObjectType } from '@nestjs/graphql'
import { Lesson } from './lessons.response'
import { DrivingSchoolExam } from './drivingSchoolExam.response'
import { DrivingLicenceTestResult } from './drivingLicenseTestResult.resopnse'

@ObjectType()
export class DrivingLicenseBook {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  licenseCategory?: string

  @Field({ nullable: true })
  createdOn?: string

  @Field({ nullable: true })
  teacherSsn?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  schoolSsn?: string

  @Field({ nullable: true })
  schoolName?: string

  @Field({ nullable: true })
  isDigital?: boolean

  @Field({ nullable: true })
  totalLessonTime?: number

  @Field({ nullable: true })
  totalLessonCount?: number

  @Field(() => [Lesson], { nullable: true })
  teachersAndLessons?: Lesson[]

  @Field(() => [DrivingSchoolExam], { nullable: true })
  drivingSchoolExams?: DrivingSchoolExam[]

  @Field(() => [DrivingLicenceTestResult], { nullable: true })
  testResults?: DrivingLicenceTestResult[]
}
