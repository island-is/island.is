import { GradeViewModel } from '../../../gen/fetch'
import {
  CourseGradeHistoryDto,
  mapCourseGradeHistoryDto,
} from './courseGradeHistory.dto'
import { GradeResultDto, mapGradeResultDto } from './gradeResult.dto'

export interface CourseDto {
  title: string
  date: Date
  competencyGrade: string
  competencyGradeStatus: string
  gradeHistory: CourseGradeHistoryDto
  improvement: GradeResultDto
  grades: Array<CourseGradeHistoryDto>
  wordsAndNumberProblemsGrade: GradeResultDto
}

export const mapCourseDto = (data: GradeViewModel): CourseDto => {
  return {
    title: data.heiti,
    date: data.dagsetning,
    competencyGrade: data.haefnieinkunn,
    competencyGradeStatus: data.haefnieinkunnStada,
    gradeHistory: mapCourseGradeHistoryDto(data.samtals),
    improvement: mapGradeResultDto(data.framfaraTexti),
    grades: data.einkunnir.map((e) => mapCourseGradeHistoryDto(e)),
    wordsAndNumberProblemsGrade: mapGradeResultDto(data.ordOgTalnadaemi),
  }
}
