import { GradeTypeResultViewModel } from '../../../gen/fetch'
import { GradeResultDto, mapGradeResultDto } from './gradeResult.dto'

export interface CourseGradeHistoryDto {
  title: string
  /** (isl: Grunnskólaeinkunn) */
  compulsorySchoolGrade: GradeResultDto
  /** Compulsory school grades when compared nationally (isl: Raðeinkunn)*/
  nationalCoordinationGrade: GradeResultDto
}

export const mapCourseGradeHistoryDto = (
  data: GradeTypeResultViewModel,
): CourseGradeHistoryDto => {
  return {
    title: data.heiti,
    compulsorySchoolGrade: mapGradeResultDto(data.grunnskolaeinkunn),
    nationalCoordinationGrade: mapGradeResultDto(data.radeinkunn),
  }
}
