import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { StudentTrackMetadata } from './studentTrackMetadata'
import { StudentFile } from './studentFile.model'
import { StudentTrackTranscript } from './studentTrackTranscript.model'

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
}
