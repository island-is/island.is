import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentTrackMetadata')
export class StudentTrackMetadata {
  @Field()
  description!: string

  @Field()
  footer!: string

  @Field({ nullable: true })
  unconfirmedData?: string
}
