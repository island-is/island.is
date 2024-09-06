import { CourseViewModel } from '../../../gen/fetch'
import {
  StudentGradeLevelAssessmentDto,
  mapStudentGradeLevelAssessmentDto,
} from './studentGradeLevelAssessment.dto'

export interface StudentAssessmentsDto {
  name: string
  nationalId: string
  assessmentsOverview: {
    assessmentsYearSpan: {
      firstAssessmentYear: Date
      lastAssessmentYear: Date
    }
    assessments: Array<StudentGradeLevelAssessmentDto>
  }
}

export const mapStudentAssessmentsDto = (
  studentName: string,
  studentNationalId: string,
  assessments: Array<CourseViewModel>,
): StudentAssessmentsDto => {
  const examDates = assessments.flatMap((a) =>
    a.namsgreinar.map((n) => n.dagsetning),
  )
  return {
    name: studentName,
    nationalId: studentNationalId,
    assessmentsOverview: {
      assessmentsYearSpan: {
        firstAssessmentYear: examDates.reduce(
          (earliest, current) => (current < earliest ? current : earliest),
          examDates[0],
        ),
        lastAssessmentYear: examDates.reduce(
          (latest, current) => (current > latest ? current : latest),
          examDates[0],
        ),
      },
      assessments: assessments.map((a) => mapStudentGradeLevelAssessmentDto(a)),
    },
  }
}
