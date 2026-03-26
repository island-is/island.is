import type {
  IslandIsAssessmentTypeDto,
  IslandIsSimpleAssignmentResultDto,
} from '@island.is/clients/mms/primary-school'
import type { PrimarySchoolAssessment } from './primarySchoolAssessment.model'
import type { PrimarySchoolAssessmentResult } from './primarySchoolAssessmentResult.model'

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
    },
    downloadServiceUrl: `${downloadServiceBaseUrl}/download/v1/education/primary-school/${studentId}/result/${item.id}/pdf`,
  }
}
