import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  getV1IslandisassessmentsByStudentIdSubjectByAssessmentSubjectIdTypes,
  getV1IslandisassessmentsByStudentIdSubjects,
  getV1IslandisassignmentresultsByStudentIdAssessmentTypeByAssessmentTypeId,
  getV1IslandisassignmentresultsByStudentIdResultByAssignmentResultIdPdf,
  getV1Islandisstudents,
  IslandIsStudentResultsDto,
  type IslandIsAssessmentSubjectDto,
  type IslandIsAssessmentTypeDto,
  type IslandIsStudentDto,
} from '../../gen/fetch'

@Injectable()
export class PrimarySchoolClientService {
  async getStudents(user: User): Promise<IslandIsStudentDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getV1Islandisstudents()),
    )
    return response ?? []
  }

  async getAssignmentResults(
    user: User,
    studentId: string,
    assessmentTypeId: string,
  ): Promise<IslandIsStudentResultsDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getV1IslandisassignmentresultsByStudentIdAssessmentTypeByAssessmentTypeId(
          {
            path: { studentId, assessmentTypeId },
          },
        ),
      ),
    )
    return response ?? []
  }

  async getAssignmentResultPdf(
    user: User,
    studentId: string,
    assignmentResultId: string,
  ): Promise<Blob | File | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getV1IslandisassignmentresultsByStudentIdResultByAssignmentResultIdPdf({
          path: { studentId, assignmentResultId },
        }),
      ),
    )
    return response
  }

  async getAssessmentSubjects(
    user: User,
    studentId: string,
  ): Promise<IslandIsAssessmentSubjectDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getV1IslandisassessmentsByStudentIdSubjects({
          path: { studentId },
        }),
      ),
    )
    return response ?? []
  }

  async getAssessmentTypes(
    user: User,
    studentId: string,
    assessmentSubjectId: string,
  ): Promise<IslandIsAssessmentTypeDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getV1IslandisassessmentsByStudentIdSubjectByAssessmentSubjectIdTypes({
          path: { studentId, assessmentSubjectId },
        }),
      ),
    )
    return response ?? []
  }
}
