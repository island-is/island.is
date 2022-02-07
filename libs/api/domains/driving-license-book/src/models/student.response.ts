import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'

@ObjectType()
export class StudentResponse {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  ssn?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  zipCode?: number

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  primaryPhoneNumber?: string

  @Field({ nullable: true })
  secondaryPhoneNumber?: string

  @Field({ nullable: true })
  active?: boolean

  @Field(() => [String], { nullable: true })
  bookLicenseCategories?: string[]
}

@ObjectType()
export class StudentOverView extends StudentResponse {
  @Field(() => [DrivingLicenseBook], { nullable: true })
  books?: DrivingLicenseBook[]
}

@ObjectType()
export class StudentOverViewResponse {
  @Field(() => StudentOverView, { nullable: true })
  data?: StudentOverView
}
