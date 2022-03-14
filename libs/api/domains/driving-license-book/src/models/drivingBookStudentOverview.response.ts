import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'
import { DrivingLicenseBookStudent } from './drivingLicenseBookStudent.response'

@ObjectType()
export class DrivingLicenseBookStudentOverview extends DrivingLicenseBookStudent {
  @Field(() => DrivingLicenseBook, { nullable: true })
  book?: DrivingLicenseBook
}
