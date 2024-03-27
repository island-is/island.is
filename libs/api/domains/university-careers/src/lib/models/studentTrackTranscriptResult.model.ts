import { createUnionType } from '@nestjs/graphql'
import { StudentTrackTranscript } from './studentTrackTranscript.model'
import { StudentTrackTranscriptError } from './studentTrackTranscriptError.model'

export const StudentTrackTranscriptResult = createUnionType({
  name: 'UniversityCareersStudentTrackTranscriptResult',
  types: () => [StudentTrackTranscript, StudentTrackTranscriptError] as const,
  resolveType(value) {
    if (value.error) {
      return StudentTrackTranscriptError
    }
    if (value.trackNumber) {
      return StudentTrackTranscript
    }

    return null
  },
})
