import { Injectable, Inject } from '@nestjs/common'
import { GradeClientService } from '@island.is/clients/mms/grade'
import { User } from '@island.is/auth-nest-tools'
import { mapCareer } from './educationMapper'
import { isDefined, unmaskString } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ExamFamilyMemberInput } from './graphql/grade/dto/familyExamResult.input'
import { FamilyCompulsorySchoolCareer } from './graphql/models/familyCareer.model'
import { StudentCareer } from './graphql/models/studentCareer.model'

@Injectable()
export class EducationServiceV2 {
  constructor(
    private readonly gradeService: GradeClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async familyCareers(
    user: User,
  ): Promise<FamilyCompulsorySchoolCareer | null> {
    const data = await this.gradeService.getUserFamilyStudentAssessments(user)

    if (!data) {
      return null
    }

    const userData = data.find((d) => d.nationalId === user.nationalId)
    const familyData = data.filter((d) => d.nationalId !== user.nationalId)

    if (!userData?.nationalId || !userData?.name) {
      return null
    }

    return {
      userCareer: mapCareer(userData, false),
      familyMemberCareers: familyData
        .filter((d) => d.nationalId !== user.nationalId)
        .map((data) => mapCareer(data, true))
        .filter(isDefined),
    }
  }

  async familyMemberCareer(
    user: User,
    input: ExamFamilyMemberInput,
  ): Promise<StudentCareer | null> {
    const data = await this.gradeService.getUserFamilyStudentAssessments(user)

    if (!data) {
      return null
    }

    if (input.maskedId === 'default') {
      const examData = data.find((d) => d.nationalId === user.nationalId)
      return examData ? mapCareer(examData, false) ?? null : null
    }

    const unmaskedNationalId = await unmaskString(
      input.maskedId,
      user.nationalId,
    )

    const examData = data.find((d) => d.nationalId === unmaskedNationalId)

    if (!examData?.nationalId || !examData?.name) {
      this.logger.warn('No exam data found for provided masked id', {
        maskedId: input.maskedId,
      })
      return null
    }

    return mapCareer(examData, false) ?? null
  }
}
