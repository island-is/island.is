import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentTrackMetadata')
export class StudentTrackMetadata {
  @Field(() => String)
  description!: string

  @Field(() => String)
  footer!: string

  @Field(() => String, { nullable: true })
  unconfirmedData?: string
}
