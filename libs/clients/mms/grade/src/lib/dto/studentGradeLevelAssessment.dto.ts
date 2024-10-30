import { CourseViewModel } from '../../../gen/fetch'
import { CourseDto, mapCourseDto } from './course.dto'

export interface StudentGradeLevelAssessmentDto {
  gradeLevel: number
  courses: Array<CourseDto>
}

export const mapStudentGradeLevelAssessmentDto = (
  data: CourseViewModel,
): StudentGradeLevelAssessmentDto => {
  return {
    gradeLevel: data.bekkur,
    courses: data.namsgreinar.map((ng) => mapCourseDto(ng)),
  }
}
