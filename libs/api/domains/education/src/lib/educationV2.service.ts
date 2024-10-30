import { Injectable, Inject } from '@nestjs/common'
import { GradeClientService } from '@island.is/clients/mms/grade'
import { User } from '@island.is/auth-nest-tools'
import { FamilyCompulsorySchoolCareer } from './models/familyCareer.model'
import { mapCareer } from './educationMapper'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

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
}
