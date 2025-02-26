import { StudentAssessmentsDto } from '@island.is/clients/mms/grade'
import { generateExamDateSpan } from '../utils'
import { StudentCareer } from '../models/primarySchool/studentCareer.model'

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
          primarySchoolGrade: c.gradeHistory.primarySchoolGrade,
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
              primarySchoolGrade: {
                grade: g.primarySchoolGrade.grade,
                weight: g.primarySchoolGrade.weight,
                label: g.primarySchoolGrade.title,
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
