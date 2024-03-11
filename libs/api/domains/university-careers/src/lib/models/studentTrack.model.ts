import { ObjectType, Field } from '@nestjs/graphql'
import { StudentTrackTranscript } from './studentTrackTranscript.model'
import { StudentTrackMetadata } from './studentTrackMetadata'
import { StudentFile } from './studentFile.model'

@ObjectType('UniversityCareersStudentTrack')
export class StudentTrack {
  @Field(() => StudentTrackTranscript)
  transcript!: StudentTrackTranscript

  @Field(() => [StudentFile], {
    description: 'Extra info about any available files for download',
  })
  files!: StudentFile[]

  @Field(() => StudentTrackMetadata)
  metadata!: StudentTrackMetadata

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}
