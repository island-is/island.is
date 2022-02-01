import { Field, ObjectType } from '@nestjs/graphql'
import { Lesson } from './lessons.response'
import { DrivingSchoolExam } from './drivingSchoolExam.response'
import { DrivingLicenceTestResult } from './drivingLicenseTestResult.resopnse'

@ObjectType()
export class DrivingLicenseBook {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  licenseCategory?: string | null

  @Field({ nullable: true })
  createdOn?: string | null

  @Field({ nullable: true })
  teacherSsn?: string | null

  @Field({ nullable: true })
  teacherName?: string | null

  @Field({ nullable: true })
  schoolSsn?: string | null

  @Field({ nullable: true })
  schoolName?: string | null

  @Field({ nullable: true })
  isDigital?: boolean

  @Field({ nullable: true })
  totalLessonTime?: number

  @Field({ nullable: true })
  totalLessonCount?: number

  @Field(() => [Lesson], { nullable: true })
  teachersAndLessons?: Lesson[] | null
  
  @Field(() => [DrivingSchoolExam], { nullable: true })
  drivingSchoolExams?: DrivingSchoolExam[] | null

  @Field(() => [DrivingLicenceTestResult], { nullable: true })
  testResults?: DrivingLicenceTestResult[] | null
}
