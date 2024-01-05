import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateDrivingSchoolTestResultInput {
  @Field()
  bookId!: string

  @Field()
  schoolTypeId!: number

  @Field()
  schoolNationalId!: string

  @Field()
  schoolEmployeeNationalId!: string

  @Field()
  createdOn!: string

  @Field()
  comments?: string
}
