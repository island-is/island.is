import { Inject, Injectable } from '@nestjs/common'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { User } from '@island.is/auth-nest-tools'
import { StudentCareer } from './models/studentCareer.model'
import { unmaskString } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class EducationServiceV3 {
  constructor(
    private readonly friggClientService: FriggClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudentCareer(
    user: User,
    studentId?: string,
  ): Promise<StudentCareer | null> {
    let studentNationalId: string | null

    if (studentId) {
      if (user.actor?.nationalId) {
        studentNationalId = await unmaskString(studentId, user.actor.nationalId)
      } else {
        this.logger.warn(
          'Student id supplied but no delegation active. Aborting...',
        )
        return null
      }
    } else {
      studentNationalId = user.nationalId
    }

    if (!studentNationalId) {
      this.logger.warn(
        studentId
          ? 'Child id unmasking failed'
          : 'no national id in user profile',
      )
      return null
    }

    const data = await this.friggClientService.getUserById(
      user,
      studentNationalId,
    )

    if (!data) {
      return null
    }

    return {
      id: studentNationalId,
      name: data.preferredName
        ? 'wrong object type for preferreedName'
        : data.name,
      primarySchoolCareer: {
        primarySchool: {
          id: 'wrong object type for primaryOrgId',
          name: 'missing from service',
        },
        teacher: {
          id: 'teacher id missing from service',
          name: 'teacher name missing from service',
          gradeLevel: data.gradeLevel,
        },
      },
    }
  }
}
