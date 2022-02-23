import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'
import { DrivingBookStudent } from './drivingBookStudent.response'

@ObjectType()
export class DrivingBookStudentOverview extends  DrivingBookStudent{
  @Field(() => DrivingLicenseBook, { nullable: true })
  book?: DrivingLicenseBook
}
