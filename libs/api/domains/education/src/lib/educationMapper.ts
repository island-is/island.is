import { StudentAssessmentsDto } from '@island.is/clients/mms/grade'
import { generateExamDateSpan } from './education.utils'
import { StudentCareer } from './models/studentCareer.model'

export const mapCareer = (
  data: StudentAssessmentsDto,
  isChildOfUser?: boolean,
): StudentCareer | undefined => {
  const { firstAssessmentYear, lastAssessmentYear } =
    data.assessmentsOverview.assessmentsYearSpan

  return {
    nationalId: data?.nationalId,
    name: data?.name,
    isChildOfUser,
    examDateSpan:
      generateExamDateSpan(firstAssessmentYear, lastAssessmentYear) ?? '',
    examResults: (data?.assessmentsOverview.assessments ?? []).map((a) => ({
      gradeLevel: a.gradeLevel,
      coursesExamResults: a.courses.map((c) => ({
        label: c.title,
        totalGrade: {
          compulsorySchoolGrade: c.gradeHistory.compulsorySchoolGrade,
          serialGrade: c.gradeHistory.nationalCoordinationGrade,
        },
        competence: {
          competencyGrade: c.competencyGrade,
          competencyStatus: c.competencyGradeStatus,
        },
        gradeCategories: [
          ...c.grades.map((g) => ({
            label: g.title,
            grade: {
              compulsorySchoolGrade: {
                grade: g.compulsorySchoolGrade.grade,
                weight: g.compulsorySchoolGrade.weight,
                label: g.compulsorySchoolGrade.title,
              },
              serialGrade: {
                grade: g.nationalCoordinationGrade.grade,
                weight: g.nationalCoordinationGrade.weight,
                label: g.nationalCoordinationGrade.title,
              },
            },
          })),
          {
            label: c.wordsAndNumberProblemsGrade.title,
            text: c.wordsAndNumberProblemsGrade.grade,
          },
          {
            label: c.improvement.title,
            text: c.improvement.grade,
          },
        ],
      })),
    })),
  }
}
