import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'
import { DrivingLicenseBookStudent } from './drivingLicenseBookStudent.response'

@ObjectType()
export class DrivingLicenseBookStudentOverview extends DrivingLicenseBookStudent {
  @Field(() => DrivingLicenseBook)
  book!: DrivingLicenseBook
}
