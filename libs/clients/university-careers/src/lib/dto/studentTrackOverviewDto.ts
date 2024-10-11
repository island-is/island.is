import { StudentFileDto } from './studentFileDto'
import { StudentTrackDto } from './studentTrackDto'
import { StudentTrackOverviewBodyDto } from './studentTrackOverviewBodyDto'

export interface StudentTrackOverviewDto {
  transcript?: StudentTrackDto
  files?: Array<StudentFileDto>
  body?: StudentTrackOverviewBodyDto
}
