import { Field, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'

@ObjectType()
export class StudentResponse {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  ssn?: string | null

  @Field({ nullable: true })
  name?: string | null

  @Field({ nullable: true })
  zipCode?: number | null

  @Field({ nullable: true })
  address?: string | null

  @Field({ nullable: true })
  email?: string | null

  @Field({ nullable: true })
  primaryPhoneNumber?: string | null

  @Field({ nullable: true })
  secondaryPhoneNumber?: string | null

  @Field({ nullable: true })
  active?: boolean

  @Field(() => [String], { nullable: true })
  bookLicenseCategories?: string[] | null
}

@ObjectType()
export class StudentOverView extends StudentResponse {
  @Field(() => [DrivingLicenseBook], { nullable: true })
  books?: DrivingLicenseBook[] | null
}

@ObjectType()
export class StudentOverViewResponse {
  @Field(() => StudentOverView, { nullable: true })
  data?: StudentOverView | null
}
