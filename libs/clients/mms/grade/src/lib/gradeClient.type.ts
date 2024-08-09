import {
  CourseViewModel,
  GradeResultViewModel,
  GradeTypeResultViewModel,
  GradeViewModel,
} from '../../gen/fetch'

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

export interface CourseDto {
  title: string
  date: Date
  competencyGrade: string
  competencyGradeStatus: string
  gradeHistory: CourseGradeHistoryDto
  improvement: GradeResultDto
  grades: Array<string>
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
    grades: data.einkunnir,
    wordsAndNumberProblemsGrade: mapGradeResultDto(data.ordOgTalnadaemi),
  }
}

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

export interface GradeResultDto {
  title: string
  grade: string
  /** The weight value for calculating the importance of a grade (isl: Vægi) */
  weight: number
}

export const mapGradeResultDto = (
  data: GradeResultViewModel,
): GradeResultDto => {
  return {
    title: data.heiti,
    grade: data.einkunn,
    weight: data.vaegi,
  }
}
