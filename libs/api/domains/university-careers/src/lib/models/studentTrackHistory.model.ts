import { Field, ObjectType } from '@nestjs/graphql'
import { StudentTrackTranscriptResult } from './studentTrackTranscriptResult.model'

@ObjectType('UniversityCareersStudentTrackHistory')
export class StudentTrackHistory {
  @Field(() => [StudentTrackTranscriptResult])
  trackResults!: Array<typeof StudentTrackTranscriptResult>
}
