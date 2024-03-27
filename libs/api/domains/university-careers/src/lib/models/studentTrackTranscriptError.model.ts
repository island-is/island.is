import { UniversityId } from '@island.is/clients/university-careers'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentTrackTranscriptError')
export class StudentTrackTranscriptError {
  @Field(() => UniversityId)
  university!: UniversityId

  @Field({ nullable: true, description: 'The error, raw' })
  error?: string
}
