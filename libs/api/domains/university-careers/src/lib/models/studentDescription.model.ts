import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentDescription')
export class StudentDescription {
  @Field(() => String)
  description!: string

  @Field(() => String)
  footer!: string

  @Field(() => String, { nullable: true })
  unconfirmedData?: string
}
