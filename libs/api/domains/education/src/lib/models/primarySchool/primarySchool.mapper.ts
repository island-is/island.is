import type {
  IslandIsAssignmentResultDto,
  IslandIsStudentResultsDto,
} from '@island.is/clients/mms/primary-school'
import type { PrimarySchoolAssignmentResult } from './primarySchoolAssignmentResult.model'
import type { PrimarySchoolStudentResults } from './primarySchoolStudentResults.model'

const mapAssignmentResult = (
  ar: IslandIsAssignmentResultDto,
): PrimarySchoolAssignmentResult | null => {
  if (!ar.id) return null
  return {
    id: ar.id,
    name: ar.name ?? undefined,
    batchNumber: ar.batchNumber ?? undefined,
    startDate: ar.scheduleStart ?? undefined,
    schedule: ar.scheduleString ?? undefined,
    score: ar.score ?? undefined,
    schoolName: ar.schoolName ?? undefined,
    evaluationDate: ar.evaluationDate ?? undefined,
    evaluationScore: ar.evaluationScore ?? undefined,
    evaluationScoreRange: ar.evaluationScoreRangeString ?? undefined,
  }
}

export const mapStudentResults = (
  r: IslandIsStudentResultsDto,
): PrimarySchoolStudentResults | null => {
  if (r.gradeLevel == null) return null
  return {
    schoolYear: r.schoolYear ?? undefined,
    gradeLevel: r.gradeLevel,
    assignmentResults:
      r.assignmentResults
        ?.map(mapAssignmentResult)
        .filter((ar): ar is PrimarySchoolAssignmentResult => ar !== null) ??
      undefined,
  }
}
