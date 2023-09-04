import { Course } from './course'
import { Requirement } from './requirement'

export type ProgramCourse = {
  id: string
  programId: string
  courseId: string
  details: Course
  requirement: Requirement
  created: Date
  modified: Date
}
