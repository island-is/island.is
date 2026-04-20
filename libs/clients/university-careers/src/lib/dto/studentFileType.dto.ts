import {
  HIFileType,
  HolarFileType,
  LHIFileType,
  LbhiFileType,
  UnakFileType,
  BifrostFileType,
} from '../clients'
import { StudentFileType } from '../universityCareers.types'

export const mapStudentFileType = (
  fileType:
    | HolarFileType
    | LbhiFileType
    | LHIFileType
    | UnakFileType
    | HIFileType
    | BifrostFileType,
): StudentFileType => {
  switch (fileType) {
    case HolarFileType.CourseDescriptions:
    case LbhiFileType.CourseDescriptions:
    case LHIFileType.CourseDescriptions:
    case UnakFileType.CourseDescriptions:
    case HIFileType.CourseDescriptions:
    case BifrostFileType.CourseDescriptions:
      return 'course_descriptions'
    case HolarFileType.Diploma:
    case LbhiFileType.Diploma:
    case LHIFileType.Diploma:
    case UnakFileType.Diploma:
    case HIFileType.Diploma:
    case BifrostFileType.Diploma:
      return 'diploma'
    case HolarFileType.DiplomaSupplement:
    case LbhiFileType.DiplomaSupplement:
    case LHIFileType.DiplomaSupplement:
    case UnakFileType.DiplomaSupplement:
    case BifrostFileType.DiplomaSupplement:
    case HIFileType.DiplomaSupplement:
      return 'diploma_supplement'
    case HolarFileType.Transcript:
    case LbhiFileType.Transcript:
    case LHIFileType.Transcript:
    case UnakFileType.Transcript:
    case HIFileType.Transcript:
    case BifrostFileType.Transcript:
      return 'transcript'
    case HolarFileType.MicroCredentialsSupplement:
    case LbhiFileType.MicroCredentialsSupplement:
    case LHIFileType.MicroCredentialsSupplement:
    case UnakFileType.MicroCredentialsSupplement:
    case HIFileType.MicroCredentialsSupplement:
    case BifrostFileType.MicroCredentialsSupplement:
      return 'micro_credentials_supplement'
    case HolarFileType.MicroCredentialsTranscript:
    case LbhiFileType.MicroCredentialsTranscript:
    case LHIFileType.MicroCredentialsTranscript:
    case UnakFileType.MicroCredentialsTranscript:
    case HIFileType.MicroCredentialsTranscript:
    case BifrostFileType.MicroCredentialsTranscript:
      return 'micro_credentials_transcript'
    default:
      return 'unknown'
  }
}
