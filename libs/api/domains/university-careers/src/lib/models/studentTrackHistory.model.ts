import { Field, ObjectType } from '@nestjs/graphql'
import { StudentTrackTranscriptError } from './studentTrackTranscriptError.model'
import { StudentTrackTranscript } from './studentTrackTranscript.model'

@ObjectType('UniversityCareersStudentTrackHistory')
export class StudentTrackHistory {
  @Field(() => [StudentTrackTranscript])
  transcripts!: Array<StudentTrackTranscript>

  @Field(() => [StudentTrackTranscriptError], { nullable: true })
  errors?: Array<StudentTrackTranscriptError>
}
