import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingBookLesson } from './drivingBookLesson.response'
import { DrivingSchoolExam } from './drivingSchoolExam.response'
import { DrivingLicenceTestResult } from './drivingLicenseTestResult.response'

@ObjectType()
export class DrivingLicenseBook {
  @Field()
  id!: string

  @Field()
  licenseCategory!: string

  @Field()
  createdOn!: string

  @Field()
  teacherNationalId!: string

  @Field()
  teacherName!: string

  @Field()
  schoolNationalId!: string

  @Field()
  schoolName!: string

  @Field()
  isDigital!: boolean

  @Field()
  status!: number

  @Field()
  statusName!: string

  @Field()
  totalLessonTime!: number

  @Field()
  totalLessonCount!: number

  @Field(() => [DrivingBookLesson])
  teachersAndLessons!: DrivingBookLesson[]

  @Field(() => [DrivingSchoolExam])
  drivingSchoolExams!: DrivingSchoolExam[]

  @Field(() => [DrivingLicenceTestResult])
  testResults!: DrivingLicenceTestResult[]

  @Field()
  practiceDriving?: boolean
}
