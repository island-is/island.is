import type {
  IslandIsAssessmentTypeDto,
  IslandIsSimpleAssignmentResultDto,
  IslandIsStudentDto,
} from '@island.is/clients/mms/primary-school'
import { isValidDate } from '@island.is/shared/utils'
import type { PrimarySchoolAssessment } from './primarySchoolAssessment.model'
import type { PrimarySchoolAssessmentResult } from './primarySchoolAssessmentResult.model'

export const mapPrimarySchoolStudent = (student: IslandIsStudentDto) => ({
  ...student,
  contactType: student.relationType,
})

export const mapAssessment = (
  type: IslandIsAssessmentTypeDto,
  studentId: string,
): PrimarySchoolAssessment | null => {
  if (!type.id) return null
  return {
    id: type.id,
    identifier: type.identifier ?? undefined,
    name: type.name ?? undefined,
    description: type.description ?? undefined,
    studentId,
  }
}

export const mapResult = (
  item: IslandIsSimpleAssignmentResultDto,
  studentId: string,
  downloadServiceBaseUrl: string,
): PrimarySchoolAssessmentResult | null => {
  if (!item.id || item.gradeLevel == null) return null

  const monthNumber =
    item.batchNumber != null &&
    item.batchNumber > 0 &&
    item.scheduleStart &&
    isValidDate(item.scheduleStart)
      ? item.scheduleStart.getMonth() + 1
      : undefined

  return {
    id: item.id,
    schoolYear: item.schoolYear ?? undefined,
    grade: {
      level: item.gradeLevel,
      name: item.gradeLevelName ?? undefined,
    },
    period: {
      startDate: item.scheduleStart ?? undefined,
      startDateString: item.scheduleString ?? undefined,
      monthNumber,
    },
    downloadServiceUrl: `${downloadServiceBaseUrl}/download/v1/education/primary-school/${studentId}/result/${item.id}/pdf`,
  }
}
