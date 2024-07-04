import { Field, ObjectType } from '@nestjs/graphql'
import { Institution } from './institution.model'

@ObjectType('UniversityCareersStudentTrackTranscriptError')
export class StudentTrackTranscriptError {
  @Field(() => Institution)
  institution!: Institution

  @Field({ nullable: true, description: 'The error, raw' })
  error?: string
}
