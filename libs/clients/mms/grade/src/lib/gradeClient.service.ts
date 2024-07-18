import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { GradesApi } from '../../gen/fetch'
import {
  mapStudentGradeLevelAssessmentDto,
  StudentGradeLevelAssessmentDto,
} from './gradeClient.type'

@Injectable()
export class GradeClientService {
  constructor(private readonly api: GradesApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getStudentAssessments(
    user: User,
  ): Promise<Array<StudentGradeLevelAssessmentDto>> {
    const data = await this.apiWithAuth(
      user,
    ).publicGradeV2ControllerGetStudentAssessment({
      nationalId: user.nationalId,
    })

    return data.einkunnir.map((e) => mapStudentGradeLevelAssessmentDto(e))
  }
}
