import { Field, ObjectType } from '@nestjs/graphql'

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
